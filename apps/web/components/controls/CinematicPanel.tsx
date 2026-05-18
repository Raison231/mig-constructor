'use client'

import { useCinematic, type CinematicMode } from '@/stores/cinematic'
import { useRealtime } from '@/stores/realtime'
import { useLocale } from '@/stores/locale'
import { t } from '@mig/i18n'
import { ARButton } from '@/components/ui/ARButton'
import { isSupabaseConfigured } from '@/lib/supabase-client'

const PANEL_STYLE: React.CSSProperties = { background: 'rgba(20, 20, 23, 0.92)', backdropFilter: 'blur(12px)', borderRadius: '0.75rem', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.06)' }
const HEAD_STYLE: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }
const TITLE_STYLE: React.CSSProperties = { color: '#F5F5F7', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase' }
const ROW_STYLE: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem', marginBottom: '0.6rem' }
const MODE_BTN_BASE: React.CSSProperties = { padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#8E8E93', fontSize: '0.72rem', cursor: 'pointer', transition: 'all 120ms ease' }
const MODE_BTN_ACTIVE: React.CSSProperties = { ...MODE_BTN_BASE, background: '#00D26A', color: '#0A0A0B', borderColor: '#00D26A', fontWeight: 600 }
const LABEL_STYLE: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#8E8E93', marginBottom: '0.2rem' }
const SLIDER_STYLE: React.CSSProperties = { width: '100%', colorScheme: 'dark', accentColor: '#00D26A' }
const DIVIDER_STYLE: React.CSSProperties = { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.7rem 0' }
const REALTIME_DOT_BASE: React.CSSProperties = { width: '0.5rem', height: '0.5rem', borderRadius: '50%', display: 'inline-block', marginRight: '0.4rem' }
const REALTIME_ROW_STYLE: React.CSSProperties = { display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: '#8E8E93' }
const DOT_ON: React.CSSProperties = { ...REALTIME_DOT_BASE, background: '#00D26A' }
const DOT_OFF: React.CSSProperties = { ...REALTIME_DOT_BASE, background: '#8E8E93' }

const MODES: CinematicMode[] = ['off', 'walkthrough', 'drone', 'orbit']

export function CinematicPanel() {
	const mode = useCinematic((s) => s.mode)
	const speed = useCinematic((s) => s.speed)
	const orbitRadius = useCinematic((s) => s.orbitRadius)
	const orbitHeight = useCinematic((s) => s.orbitHeight)
	const walkHeight = useCinematic((s) => s.walkHeight)
	const walkSpeed = useCinematic((s) => s.walkSpeed)
	const setMode = useCinematic((s) => s.setMode)
	const setSpeed = useCinematic((s) => s.setSpeed)
	const setOrbitRadius = useCinematic((s) => s.setOrbitRadius)
	const setOrbitHeight = useCinematic((s) => s.setOrbitHeight)
	const setWalkHeight = useCinematic((s) => s.setWalkHeight)
	const setWalkSpeed = useCinematic((s) => s.setWalkSpeed)
	const connected = useRealtime((s) => s.connected)
	const cursors = useRealtime((s) => s.cursors)
	const locale = useLocale((s) => s.locale)
	const peers = Object.keys(cursors).length

	const rtLabel = isSupabaseConfigured()
		? connected ? `${t('realtime.online', locale)} · ${peers} ${t('realtime.peers', locale)}` : t('realtime.connecting', locale)
		: t('realtime.offline', locale)

	return (
		<div style={PANEL_STYLE}>
			<div style={HEAD_STYLE}>
				<span style={TITLE_STYLE}>{t('cinematic.title', locale)}</span>
				<ARButton />
			</div>
			<div style={ROW_STYLE}>
				{MODES.map((m) => (
					<button key={m} type="button" onClick={() => setMode(m)} style={mode === m ? MODE_BTN_ACTIVE : MODE_BTN_BASE}>
						{t(`cinematic.${m}`, locale)}
					</button>
				))}
			</div>
			{(mode === 'drone' || mode === 'orbit') && (
				<>
					<div style={LABEL_STYLE}><span>{t('cinematic.speed', locale)}</span><span>{speed.toFixed(2)}x</span></div>
					<input type="range" min={0.1} max={3} step={0.1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={SLIDER_STYLE} />
					<div style={LABEL_STYLE}><span>{t('cinematic.radius', locale)}</span><span>{orbitRadius.toFixed(0)}m</span></div>
					<input type="range" min={5} max={40} step={1} value={orbitRadius} onChange={(e) => setOrbitRadius(Number(e.target.value))} style={SLIDER_STYLE} />
					<div style={LABEL_STYLE}><span>{t('cinematic.height', locale)}</span><span>{orbitHeight.toFixed(0)}m</span></div>
					<input type="range" min={2} max={30} step={1} value={orbitHeight} onChange={(e) => setOrbitHeight(Number(e.target.value))} style={SLIDER_STYLE} />
				</>
			)}
			{mode === 'walkthrough' && (
				<>
					<div style={LABEL_STYLE}><span>{t('cinematic.eyeHeight', locale)}</span><span>{walkHeight.toFixed(2)}m</span></div>
					<input type="range" min={0.5} max={2.2} step={0.05} value={walkHeight} onChange={(e) => setWalkHeight(Number(e.target.value))} style={SLIDER_STYLE} />
					<div style={LABEL_STYLE}><span>{t('cinematic.walkSpeed', locale)}</span><span>{walkSpeed.toFixed(1)} m/s</span></div>
					<input type="range" min={1} max={6} step={0.1} value={walkSpeed} onChange={(e) => setWalkSpeed(Number(e.target.value))} style={SLIDER_STYLE} />
				</>
			)}
			<div style={DIVIDER_STYLE} />
			<div style={REALTIME_ROW_STYLE}>
				<span style={connected ? DOT_ON : DOT_OFF} />
				<span>{rtLabel}</span>
			</div>
		</div>
	)
}
