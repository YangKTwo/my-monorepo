import type { SizingStyleHistoryItem } from '@my-repo/apis'

export type { SizingStyleHistoryItem }

export interface CapStylePast5DialogProps {
  modelValue: boolean
  data: SizingStyleHistoryItem[]
  width?: string
}
