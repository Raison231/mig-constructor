import { create } from 'zustand'

export type MobileTab = 'build' | 'world' | 'pro' | 'ai' | 'cost'

type MobileUiState = {
  /** Currently active bottom-sheet tab, or null when sheet is closed. */
  activeTab: MobileTab | null
  /** Whether the top-right more-menu overlay is open. */
  moreMenuOpen: boolean
  setActiveTab: (tab: MobileTab | null) => void
  /** If the same tab is tapped again, the sheet closes. Otherwise it opens that tab. */
  toggleTab: (tab: MobileTab) => void
  setMoreMenuOpen: (open: boolean) => void
  closeAll: () => void
}

export const useMobileUi = create<MobileUiState>((set) => ({
  activeTab: null,
  moreMenuOpen: false,
  setActiveTab: (activeTab) => set({ activeTab }),
  toggleTab: (tab) => set((s) => ({ activeTab: s.activeTab === tab ? null : tab })),
  setMoreMenuOpen: (moreMenuOpen) => set({ moreMenuOpen }),
  closeAll: () => set({ activeTab: null, moreMenuOpen: false }),
}))
