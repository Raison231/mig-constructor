'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { useMobileUi } from '@/stores/mobileUi'
import { useConfigurator } from '@/stores/configurator'
import { useWorld, type Weather, type Site, type CameraMode } from '@/stores/world'
import { useLand } from '@/stores/land'
import { useThreeRef } from '@/stores/threeRef'
import { useLocale, type Locale } from '@/stores/locale'
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

const MENU_STYLE: CSSProperties = {
  top: 'calc(4rem + env(safe-area-inset-top, 0px))',
}

const TOAST_STYLE: CSSProperties = {
  top: 'calc(5.25rem + env(safe-area-inset-top, 0px))',
}

const LOCALES: Locale[] = ['ru', 'en', 'ka']
const LOCALE_LABELS: Record<Locale, string> = { ru: 'RU', en: 'EN', ka: 'KA' }

/**
 * Mobile-only overflow menu (triggered by hamburger in MobileTopBar).
 * Contains all Header actions: save/load .mig, GLB export, share, screenshot, reset, locale switcher.
 */
export function MobileMoreMenu() {
  const open = useMobileUi((s) => s.moreMenuOpen)
  const setOpen = useMobileUi((s) => s.setMoreMenuOpen)
  const locale = useLocale((s) => s.locale)
  const setLocale = useLocale((s) => s.setLocale)
  const modules = useConfigurator((s) => s.modules)
  const setLayout = useConfigurator((s) => s.setLayout)
  const reset = useConfigurator((s) => s.reset)
  const [toast, setToast] = useState<string | null>(null)

  function flash(msg: string, ms = 1800) {
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
      const scene: MigFile = {
        version: 1,
        createdAt: new Date().toISOString(),
        app: 'mig-constructor',
        modules,
        world: { hour: w.hour, weather: w.weather, site: w.site, cameraMode: w.cameraMode },
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
      }
      const bytes = await encodeMigFile(bundle)
      await saveMigFile(bytes, `mig-scene-${Date.now()}.mig`)
      flash('💾 Сохранено')
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
      setLayout(bundle.scene.modules)
      const w = useWorld.getState()
      w.setHour(bundle.scene.world.hour)
      w.setWeather(bundle.scene.world.weather as Weather)
      w.setSite(bundle.scene.world.site as Site)
      w.setCameraMode(bundle.scene.world.cameraMode as CameraMode)
      useLand.getState().hydrateFromBundle(bundle)
      flash('📂 Загружено')
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
      flash('📦 GLB экспорт')
    } catch (e) {
      console.error('[glb export]', e)
      flash('Ошибка GLB')
    }
  }

  if (!open) return null

  return (
    <div className="md:hidden fixed inset-0 z-40 pointer-events-auto">
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-up"
        aria-hidden="true"
      />
      <div
        className="absolute right-3 w-72 max-w-[calc(100vw-1.5rem)] glass-strong rounded-3xl p-3 animate-fade-up shadow-2xl"
        style={MENU_STYLE}
        role="menu"
      >
        <div className="flex items-center justify-between px-1.5 pb-2">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">
            Меню
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-hairline bg-white/60 px-2 py-0.5 text-[10px] font-bold text-ink2 hover:bg-white transition active:scale-95"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
        <div className="space-y-1">
          <MenuItem emoji="💾" label="Сохранить .mig" onClick={() => { saveMig(); setOpen(false) }} />
          <MenuItem emoji="📂" label="Открыть .mig" onClick={() => { loadMig(); setOpen(false) }} />
          <MenuItem emoji="📦" label="Экспорт GLB" onClick={() => { exportGlb(); setOpen(false) }} />
          <MenuItem emoji="⤴" label={t('header.share', locale)} onClick={() => { share(); setOpen(false) }} />
          <MenuItem emoji="⎉" label={t('header.screenshot', locale)} onClick={() => { downloadSceneScreenshot(); setOpen(false) }} />
          <MenuItem emoji="⟲" label={t('header.reset', locale)} danger onClick={() => { reset(); setOpen(false) }} />
        </div>
        <div className="mt-3 pt-3 border-t border-hairline">
          <div className="text-[9px] uppercase tracking-[0.18em] text-ink3 px-1.5 mb-1.5">
            Язык
          </div>
          <div className="flex gap-1">
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={
                  'flex-1 rounded-xl py-1.5 text-[11px] font-bold transition active:scale-95 ' +
                  (locale === l
                    ? 'bg-brand-primary text-white shadow-aurora-primary'
                    : 'border border-hairline bg-white/60 text-ink2 hover:bg-white')
                }
                aria-pressed={locale === l}
              >
                {LOCALE_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
      </div>
      {toast && (
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 animate-fade-up rounded-full bg-brand-primary px-4 py-1.5 text-[11px] font-bold text-white shadow-aurora-primary"
          style={TOAST_STYLE}
        >
          {toast}
        </div>
      )}
    </div>
  )
}

function MenuItem({
  emoji,
  label,
  onClick,
  danger = false,
}: {
  emoji: string
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="menuitem"
      className={
        'w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[12.5px] font-bold transition active:scale-[0.98] ' +
        (danger ? 'text-brand-coral hover:bg-brand-coral/10' : 'text-ink hover:bg-white')
      }
    >
      <span className="text-base leading-none">{emoji}</span>
      <span className="flex-1 text-left">{label}</span>
    </button>
  )
}
