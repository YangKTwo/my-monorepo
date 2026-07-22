export interface FrameDialogProps {
  /** 弹窗宽度，需与面板同宽 */
  width?: string
  /** 自定义背景框，默认 vBack_dialog.svg */
  frameSrc?: string
  /** 自定义关闭图标 */
  closeSrc?: string
  /** 距顶栏下移，避免贴顶 */
  offsetTop?: string
}
