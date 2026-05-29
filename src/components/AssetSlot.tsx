import type { CSSProperties, ReactNode } from 'react'
import type { AssetKey } from '../data/beijingAssets'
import { useCityPack } from '../data/cityPackRuntime'

export function AssetSlot({
  assetKey,
  accent = '#96342e',
  className = '',
  children,
}: {
  assetKey: AssetKey
  accent?: string
  className?: string
  children?: ReactNode
}) {
  const cityPack = useCityPack()

  return (
    <div
      className={`asset-slot ${className}`}
      style={
        {
          '--accent': accent,
          '--asset-url': `url("${cityPack.assetUrl(assetKey)}")`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}
