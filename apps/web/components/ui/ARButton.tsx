'use client'

import { useEffect, useState } from 'react'
import { useAR } from '@/stores/ar'
import { isARSupported, getARCapabilityHint } from '@/lib/ar-utils'
import { xrStore } from '@/components/three/ARScene'
import { useLocale } from '@/stores/locale'
import { t } from '@mig/i18n'

const BTN_STYLE: React.CSSProperties = {
	display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
	padding: '0.55rem 1rem', borderRadius: '0.75rem',
	background: '#00D26A', color: '#0A0A0B', fontWeight: 600, fontSize: '0.875rem',
	cursor: 'pointer', border: 'none',
	boxShadow: '0 0 24px rgba(0, 210, 106, 0.35)',
	transition: 'transform 120ms ease',
}

const BTN_DISABLED_STYLE: React.CSSProperties = {
	...BTN_STYLE, background: '#1f1f23', color: '#8E8E93', cursor: 'not-allowed', boxShadow: 'none',
}

const HINT_STYLE: React.CSSProperties = {
	marginTop: '0.5rem', fontSize: '0.75rem', color: '#8E8E93', maxWidth: '14rem', lineHeight: 1.4,
}

export function ARButton() {
	const status = useAR((s) => s.status)
	const supported = useAR((s) => s.supported)
	const setSupported = useAR((s) => s.setSupported)
	const setStatus = useAR((s) => s.setStatus)
	const locale = useLocale((s) => s.locale)
	const [hint, setHint] = useState('')

	useEffect(() => {
		let active = true
		isARSupported().then((ok) => {
			if (!active) return
			setSupported(ok)
			if (!ok) { setStatus('unsupported'); setHint(getARCapabilityHint().hint) }
		})
		return () => { active = false }
	}, [setSupported, setStatus])

	const handleClick = async () => {
		if (!supported) return
		setStatus('requesting')
		try { await xrStore.enterAR(); setStatus('active') } catch { setStatus('denied') }
	}

	const label =
		status === 'active' ? t('ar.active', locale) :
		status === 'requesting' ? t('ar.requesting', locale) :
		t('ar.enter', locale)

	return (
		<div>
			<button
				type="button"
				onClick={handleClick}
				disabled={!supported || status === 'requesting' || status === 'active'}
				style={supported ? BTN_STYLE : BTN_DISABLED_STYLE}
			>
				<span>📱</span>
				<span>{label}</span>
			</button>
			{!supported && hint ? <div style={HINT_STYLE}>{hint}</div> : null}
		</div>
	)
}
