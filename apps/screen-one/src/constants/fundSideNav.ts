import type { ScreenSideNavItem } from '@my-repo/business'

/** 智能分析 · 资金侧栏 */
export const fundSideNavItems: ScreenSideNavItem[] = [
  { label: '主力资金', path: '/fund/main-force' },
  { label: '北向资金预估', path: '/fund/northbound' },
  { label: '资金占比', path: '/fund/ratio' },
  { label: '市场份额', path: '/fund/market-share' },
  { label: '指数资金', path: '/fund/index-fund' },
  { label: '资金预估', path: '/fund/estimate' },
  { label: '资金流', path: '/fund/flow' }
]
