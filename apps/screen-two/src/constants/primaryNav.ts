import homeIcon from '@my-repo/ui/src/assets/src/icons/dashboard_blue_selected.svg'
import fundIcon from '@my-repo/ui/src/assets/src/icons/money_default.svg'
import plateIcon from '@my-repo/ui/src/assets/src/icons/sector_default.svg'
import indexIcon from '@my-repo/ui/src/assets/src/icons/index_default.svg'
import stockIcon from '@my-repo/ui/src/assets/src/icons/stock_default.svg'
import timeIcon from '@my-repo/ui/src/assets/src/icons/time_default.svg'
import type { ScreenNavItem } from '@my-repo/business'
// import techIcon from '@my-repo/ui/src/assets/src/icons/submenu_button_default.svg'

export interface PrimaryNavItem {
  label: string
  path: string
  icon: string
  match?: RegExp
}

export const primaryNavItems: ScreenNavItem[] = [
  { label: '首页', path: '/home', icon: homeIcon },
  { label: '资金', path: '/fund', icon: fundIcon },
  { label: '板块', path: '/plate', icon: plateIcon },
  { label: '指数', path: '/index', icon: indexIcon },
  { label: '个股', path: '/stock', icon: stockIcon },
  { label: '时间', path: '/time', icon: timeIcon }
  // { label: '科技', path: '/tech', icon: techIcon }
]
