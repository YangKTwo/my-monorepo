import { SizingStyleProb } from '@my-repo/apis'
import { CapDominant, CapStyleViewModel } from './types'

function resolveDominant(style: string, big: number, small: number): CapDominant {
  const s = style || ''
  if (s.includes('大盘')) return 'big'
  if (s.includes('小盘')) return 'small'
  if (s.includes('均衡')) return 'balance'
  if (Math.abs(big - small) < 0.01) return 'balance'
  return big >= small ? 'big' : 'small'
}

export function mapSizingStyleProbToView(raw: SizingStyleProb): CapStyleViewModel {
  const big = Number((raw.bigStyleRatio ?? 0).toFixed(2))
  const small = Number((raw.smallStyleRatio ?? 0).toFixed(2))
  const dominant = resolveDominant(raw.style ?? '', big, small)

  const dominantPct =
    dominant === 'small' ? small : dominant === 'big' ? big : Number(((big + small) / 2).toFixed(2))

  return {
    big,
    small,
    dominant,
    dominantPct,
    verdictText: raw.style || ''
  }
}
