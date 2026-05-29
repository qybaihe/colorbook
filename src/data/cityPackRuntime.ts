import { createContext, useContext } from 'react'
import { cityPacks, type CityPack } from './cityPacks'

export const CityPackContext = createContext<CityPack>(cityPacks.beijing)

export function useCityPack() {
  return useContext(CityPackContext)
}
