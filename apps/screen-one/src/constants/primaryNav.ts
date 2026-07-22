import homeIcon from '@my-repo/ui/src/assets/src/icons/dashboard_brown_selected.svg'
import fundIcon from '@my-repo/ui/src/assets/src/icons/money_default.svg'
import indexIcon from '@my-repo/ui/src/assets/src/icons/index_default.svg'
import plateIcon from '@my-repo/ui/src/assets/src/icons/sector_default.svg'
import stockIcon from '@my-repo/ui/src/assets/src/icons/stock_default.svg'
import timeIcon from '@my-repo/ui/src/assets/src/icons/time_default.svg'
import type { ScreenNavItem } from '@my-repo/business'

/** 一级导航：首页 / 资金 / 指数 / 板块 / 个股 / 时间 */
export const primaryNavItems: ScreenNavItem[] = [
  { label: '首页', path: '/home', icon: homeIcon },
  { label: '资金', path: '/fund', icon: fundIcon },
  { label: '指数', path: '/index', icon: indexIcon },
  { label: '板块', path: '/plate', icon: plateIcon },
  { label: '个股', path: '/stock', icon: stockIcon },
  { label: '时间', path: '/time', icon: timeIcon }
]
