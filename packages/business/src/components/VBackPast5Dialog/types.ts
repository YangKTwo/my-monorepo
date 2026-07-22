import type { VBackSuccessRow } from '@my-repo/apis'

export type { VBackSuccessRow }

export interface VBackPast5DialogProps {
  modelValue: boolean
  data: VBackSuccessRow[]
  /** 透传弹窗宽度，默认 640px */
  width?: string
}
