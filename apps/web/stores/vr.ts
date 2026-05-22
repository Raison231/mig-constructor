'use client'

import { create } from 'zustand'

export type VRStatus = 'idle' | 'requesting' | 'active' | 'unsupported' | 'denied'

type Persisted = {
  teleportEnabled: boolean
  locomotionSpeed: number
}

type VRState = Persisted & {
  supported: boolean
  status: VRStatus
  xrOrigin: [number, number, number]
  setSupported: (s: boolean) => void
  setStatus: (s: VRStatus) => void
  setTeleportEnabled: (v: boolean) => void
  setLocomotionSpeed: (v: number) => void
  setXrOrigin: (p: [number, number, number]) => void
  reset: () => void
}

const STORAGE_KEY = 'mig-vr-v1'

function loadPersisted(): Persisted {
  const fallback: Persisted = { teleportEnabled: true, locomotionSpeed: 1.5 }
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<Persisted>
    return {
      teleportEnabled:
        typeof parsed.teleportEnabled === 'boolean' ? parsed.teleportEnabled : fallback.teleportEnabled,
      locomotionSpeed:
        typeof parsed.locomotionSpeed === 'number' ? parsed.locomotionSpeed : fallback.locomotionSpeed,
    }
  } catch {
    return fallback
  }
}

function persist(state: Persisted) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export const useVR = create<VRState>((set, get) => ({
  ...loadPersisted(),
  supported: false,
  status: 'idle',
  xrOrigin: [0, 0, 0],
  setSupported: (supported) => set({ supported }),
  setStatus: (status) => set({ status }),
  setTeleportEnabled: (teleportEnabled) => {
    set({ teleportEnabled })
    persist({ teleportEnabled, locomotionSpeed: get().locomotionSpeed })
  },
  setLocomotionSpeed: (v) => {
    const locomotionSpeed = Math.max(0, Math.min(3, v))
    set({ locomotionSpeed })
    persist({ teleportEnabled: get().teleportEnabled, locomotionSpeed })
  },
  setXrOrigin: (xrOrigin) => set({ xrOrigin }),
  reset: () => set({ status: 'idle', xrOrigin: [0, 0, 0] }),
}))
