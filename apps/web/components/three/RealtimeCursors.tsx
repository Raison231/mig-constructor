'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRealtime, pickRealtimeColor, type PresenceCursor } from '@/stores/realtime'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase-client'
import * as THREE from 'three'

const CURSOR_GEO = new THREE.SphereGeometry(0.18, 16, 16)
const RING_GEO = new THREE.RingGeometry(0.22, 0.28, 24)
const PRESENCE_THROTTLE_MS = 100
const STALE_MS = 8000
const RING_ROT: [number, number, number] = [-Math.PI / 2, 0, 0]
const RING_POS: [number, number, number] = [0, -0.15, 0]

function useSelfRandom() {
	return useMemo(
		() => ({
			id: `u_${Math.random().toString(36).slice(2, 10)}`,
			name: `Guest_${Math.floor(Math.random() * 1000)}`,
			color: pickRealtimeColor(),
		}),
		[],
	)
}

export function RealtimeCursors() {
	const roomId = useRealtime((s) => s.roomId)
	const cursors = useRealtime((s) => s.cursors)
	const setSelf = useRealtime((s) => s.setSelf)
	const setConnected = useRealtime((s) => s.setConnected)
	const upsertCursor = useRealtime((s) => s.upsertCursor)
	const removeCursor = useRealtime((s) => s.removeCursor)
	const self = useSelfRandom()
	const { camera, raycaster, pointer } = useThree()
	const lastSendRef = useRef(0)
	const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
	const hitVec = useMemo(() => new THREE.Vector3(), [])

	useEffect(() => {
		setSelf(self)
	}, [self, setSelf])

	useEffect(() => {
		if (!isSupabaseConfigured()) return
		const supabase = getSupabase()
		if (!supabase) return

		const channel = supabase.channel(`mig:${roomId}`, {
			config: { presence: { key: self.id } },
		})

		channel
			.on('presence', { event: 'sync' }, () => {
				const state = channel.presenceState<PresenceCursor>()
				for (const [key, list] of Object.entries(state)) {
					const entry = list[0]
					if (entry && key !== self.id) upsertCursor({ ...entry, userId: key })
				}
			})
			.on('presence', { event: 'leave' }, ({ key }) => removeCursor(key))
			.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					setConnected(true)
					await channel.track({ userId: self.id, name: self.name, color: self.color, x: 0, y: 0, z: 0, at: Date.now() })
				}
			})

		return () => {
			setConnected(false)
			supabase.removeChannel(channel)
		}
	}, [roomId, self, setConnected, upsertCursor, removeCursor])

	useFrame(() => {
		const now = performance.now()
		if (now - lastSendRef.current < PRESENCE_THROTTLE_MS) return
		lastSendRef.current = now
		if (!isSupabaseConfigured()) return
		const supabase = getSupabase()
		if (!supabase) return
		raycaster.setFromCamera(pointer, camera)
		if (!raycaster.ray.intersectPlane(groundPlane, hitVec)) return
		const channel = supabase.getChannels().find((c) => c.topic === `realtime:mig:${roomId}`)
		if (!channel) return
		channel.track({ userId: self.id, name: self.name, color: self.color, x: hitVec.x, y: 0.05, z: hitVec.z, at: Date.now() })
	})

	const now = Date.now()
	const entries = Object.values(cursors).filter((c) => now - c.at < STALE_MS)

	return (
		<group>
			{entries.map((c) => (
				<group key={c.userId} position={[c.x, c.y, c.z]}>
					<mesh geometry={CURSOR_GEO}>
						<meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.6} />
					</mesh>
					<mesh geometry={RING_GEO} rotation={RING_ROT} position={RING_POS}>
						<meshBasicMaterial color={c.color} transparent opacity={0.5} />
					</mesh>
				</group>
			))}
		</group>
	)
}
