import type { CSSProperties, ReactNode } from 'react'
import { assetUrl, type AssetKey } from '../data/beijingAssets'

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
  return (
    <div
      className={`asset-slot ${className}`}
      style={
        {
          '--accent': accent,
          '--asset-url': `url("${assetUrl(assetKey)}")`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}

