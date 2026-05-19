'use client'

import { useEffect, useState } from 'react'
import { useConfigurator } from '@/stores/configurator'
import { useLocale, type Locale } from '@/stores/locale'
import { useWorld, type Weather, type Site, type CameraMode } from '@/stores/world'
import { useLand } from '@/stores/land'
import { useThreeRef } from '@/stores/threeRef'
import { useCinematic } from '@/stores/cinematic'
import { useCustomModules } from '@/stores/customModules'
import { useAR } from '@/stores/ar'
import { t } from '@mig/i18n'
import { copyShareLink } from '@/lib/url-state'
import { downloadSceneScreenshot } from '@/lib/screenshot'
import {
  encodeMigFile,
  decodeMigFile,
  saveMigFile,
  pickMigFile,
  imageDataUrlToBytes,
  type MigFile,
  type MigBundle,
} from '@/lib/migFile'
import { exportSceneToGlb } from '@/lib/glbExport'
import { xrStore } from '@/components/three/ARScene'
import { HealthBadge } from './HealthBadge'

const LOCALES: Locale[] = ['ru', 'en', 'ka']
const LOCALE_LABELS: Record<Locale, string> = { ru: 'RU', en: 'EN', ka: 'KA' }

export function Header() {
  const locale = useLocale((s) => s.locale)
  const setLocale = useLocale((s) => s.setLocale)
  const modules = useConfigurator((s) => s.modules)
  const setLayout = useConfigurator((s) => s.setLayout)
  const reset = useConfigurator((s) => s.reset)
  const cinematicMode = useCinematic((s) => s.mode)
  const setCinematicMode = useCinematic((s) => s.setMode)
  const arStatus = useAR((s) => s.status)
  const arSupported = useAR((s) => s.supported)
  const setArSupported = useAR((s) => s.setSupported)
  const setArStatus = useAR((s) => s.setStatus)
  const [toast, setToast] = useState<string | null>(null)

  const walkActive = cinematicMode === 'walkthrough'
  const arActive = arStatus === 'active'

  // One-shot capability check for immersive-ar
  useEffect(() => {
    let cancelled = false
    const nav = navigator as Navigator & { xr?: { isSessionSupported?: (mode: string) => Promise<boolean> } }
    if (!nav.xr || !nav.xr.isSessionSupported) {
      setArSupported(false)
      return
    }
    nav.xr.isSessionSupported('immersive-ar').then((ok) => {
      if (!cancelled) setArSupported(!!ok)
    }).catch(() => { if (!cancelled) setArSupported(false) })
    return () => { cancelled = true }
  }, [setArSupported])

  function flash(msg: string, ms = 2000) {
    setToast(msg)
    setTimeout(() => setToast(null), ms)
  }

  async function share() {
    const ok = await copyShareLink(modules)
    flash(t(ok ? 'share.copied' : 'share.failed', locale))
  }

  async function saveMig() {
    try {
      const w = useWorld.getState()
      const l = useLand.getState()
      const customList = useCustomModules.getState().list()
      const scene: MigFile = {
        version: 2,
        createdAt: new Date().toISOString(),
        app: 'mig-constructor',
        modules,
        world: {
          hour: w.hour,
          weather: w.weather,
          site: w.site,
          cameraMode: w.cameraMode,
          dayNightAuto: w.dayNightAuto,
          dayNightSpeed: w.dayNightSpeed,
        },
        land: {
          widthMeters: l.widthMeters,
          rotationDeg: l.rotationDeg,
          offsetX: l.offsetX,
          offsetZ: l.offsetZ,
          lat: l.lat,
          lon: l.lon,
          hasImage: !!l.imageDataUrl,
          hasHeightmap: !!l.heightmap,
          heightmapSize: l.heightmapSize,
          heightmapScale: l.heightmapScale,
        },
      }
      let landImage: Uint8Array | undefined
      let landImageMime: string | undefined
      if (l.imageDataUrl) {
        const { bytes, mime } = imageDataUrlToBytes(l.imageDataUrl)
        landImage = bytes
        landImageMime = mime
      }
      const bundle: MigBundle = {
        scene,
        landImage,
        landImageMime,
        heightmap: l.heightmap ?? undefined,
        customModules: customList,
      }
      const bytes = await encodeMigFile(bundle)
      await saveMigFile(bytes, `mig-scene-${Date.now()}.mig`)
      flash(customList.length > 0 ? `💾 Сохранено + ${customList.length} GLB` : '💾 Сохранено')
    } catch (e) {
      console.error('[save .mig]', e)
      flash('Ошибка сохранения')
    }
  }

  async function loadMig() {
    try {
      const bytes = await pickMigFile()
      if (!bytes) return
      const bundle = await decodeMigFile(bytes)
      // 1. Restore custom GLB modules BEFORE setLayout so configurator can resolve custom:* ids.
      if (bundle.customModules && bundle.customModules.length > 0) {
        const cm = useCustomModules.getState()
        for (const c of bundle.customModules) cm.add(c)
      }
      setLayout(bundle.scene.modules)
      const w = useWorld.getState()
      w.setHour(bundle.scene.world.hour)
      w.setWeather(bundle.scene.world.weather as Weather)
      w.setSite(bundle.scene.world.site as Site)
      w.setCameraMode(bundle.scene.world.cameraMode as CameraMode)
      if (typeof bundle.scene.world.dayNightAuto === 'boolean') {
        w.setDayNightAuto(bundle.scene.world.dayNightAuto)
      }
      if (typeof bundle.scene.world.dayNightSpeed === 'number') {
        w.setDayNightSpeed(bundle.scene.world.dayNightSpeed)
      }
      useLand.getState().hydrateFromBundle(bundle)
      const customCount = bundle.customModules?.length ?? 0
      flash(customCount > 0 ? `📂 Загружено + ${customCount} GLB` : '📂 Загружено')
    } catch (e) {
      console.error('[load .mig]', e)
      flash('Ошибка загрузки')
    }
  }

  function exportGlb() {
    try {
      const scene = useThreeRef.getState().scene
      if (!scene) {
        flash('Сцена не готова')
        return
      }
      exportSceneToGlb(scene, `mig-scene-${Date.now()}.glb`)
      flash('📦 GLB экспортировано')
    } catch (e) {
      console.error('[glb export]', e)
      flash('Ошибка GLB')
    }
  }

  function toggleWalk() {
    setCinematicMode(walkActive ? 'off' : 'walkthrough')
    flash(walkActive ? '🚶 Выход из Walk' : '🚶 Walk Mode: кликни по сцене')
  }

  async function enterAR() {
    if (!arSupported) {
      flash('AR не поддерживается в этом браузере')
      setArStatus('unsupported')
      return
    }
    try {
      setArStatus('requesting')
      await xrStore.enterAR()
      // ARScene subscribes to xrStore and will flip status → 'active' when session starts
    } catch (e) {
      console.error('[enter AR]', e)
      setArStatus('denied')
      flash('AR отклонен')
    }
  }

  async function exitAR() {
    try { await xrStore.getState().session?.end() } catch {}
    setArStatus('idle')
  }

  return (
    <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-6">
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="aurora-glow relative h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-field shadow-aurora-primary flex items-center justify-center">
          <span className="text-white text-lg font-extrabold drop-shadow">M</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-mono text-[13px] font-semibold tracking-[0.04em] text-ink">MIG.CONSTRUCTOR</span>
          <span className="mt-0.5 text-[10px] tracking-wider text-ink3 uppercase">{t('app.subtitle', locale)}</span>
        </div>
        <span className="ml-2 rounded-full bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 text-[10px] font-semibold tracking-wide border border-brand-primary/20">AURORA · v0.12</span>
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={toggleWalk}
          className={`rounded-2xl px-3.5 py-1.5 text-xs font-semibold transition border ${walkActive ? 'bg-emerald-500 text-white border-emerald-500 shadow-aurora-primary' : 'glass text-ink border-transparent hover:bg-white'}`}
          title="Walk Mode — пройтись по участку от первого лица"
        >
          🚶 {walkActive ? 'Walk ✖' : 'Walk'}
        </button>
        <button
          onClick={arActive ? exitAR : enterAR}
          disabled={!arSupported && !arActive}
          className={`rounded-2xl px-3.5 py-1.5 text-xs font-semibold transition border ${arActive ? 'bg-brand-field text-white border-brand-field shadow-aurora-primary' : arSupported ? 'glass text-ink border-transparent hover:bg-white' : 'glass text-ink3 border-transparent opacity-50 cursor-not-allowed'}`}
          title={arSupported ? (arActive ? 'Выйти из AR' : 'Войти в AR (WebXR)') : 'AR не поддерживается'}
        >
          🥽 {arActive ? 'AR ✖' : 'AR'}
        </button>
        <HealthBadge />
        <span className="w-px h-5 bg-hairline mx-0.5" aria-hidden />
        <button onClick={saveMig} className="glass rounded-2xl px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-white transition" title="Сохранить сцену в .mig (v2)">💾 .mig</button>
        <button onClick={loadMig} className="glass rounded-2xl px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-white transition" title="Открыть .mig (v1/v2)">📂 Открыть</button>
        <button onClick={exportGlb} className="glass rounded-2xl px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-white transition" title="Экспорт в GLB">📦 GLB</button>
        <button onClick={share} className="glass rounded-2xl px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-white transition">⤴ {t('header.share', locale)}</button>
        <button onClick={downloadSceneScreenshot} className="glass rounded-2xl px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-white transition">⎉ {t('header.screenshot', locale)}</button>
        <button onClick={reset} className="glass rounded-2xl px-3.5 py-1.5 text-xs font-semibold text-brand-coral hover:bg-brand-coral hover:text-white transition">⟲ {t('header.reset', locale)}</button>

        <div className="ml-2 flex gap-0.5 rounded-full glass p-1">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
                locale === l ? 'bg-brand-primary text-white shadow-aurora-primary' : 'text-ink2 hover:text-ink'
              }`}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 animate-fade-up rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white shadow-aurora-primary">
          {toast}
        </div>
      )}
    </header>
  )
}
