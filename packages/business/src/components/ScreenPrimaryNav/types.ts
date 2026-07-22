export interface ScreenNavItem {
  label: string
  path: string
  /** 未选中 */
  icon: string
  /** 悬浮（不传则回退 icon） */
  hoverIcon?: string
  /** 选中（不传则回退 icon） */
  activeIcon?: string
  match?: string | RegExp
}
