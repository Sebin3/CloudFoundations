import { createContext, useContext } from 'react'

export const SelectedRegionContext = createContext<{ selectedRegion: string; setSelectedRegion: (region: string) => void } | null>(null)

export function useSelectedRegion() {
  const context = useContext(SelectedRegionContext)
  if (!context) throw new Error('useSelectedRegion must be used inside DashboardLayout')
  return context
}
