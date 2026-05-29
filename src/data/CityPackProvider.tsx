import type { ReactNode } from 'react'
import type { CityPack } from './cityPacks'
import { CityPackContext } from './cityPackRuntime'

export function CityPackProvider({ cityPack, children }: { cityPack: CityPack; children: ReactNode }) {
  return <CityPackContext.Provider value={cityPack}>{children}</CityPackContext.Provider>
}
