import homeDefault from '@my-repo/ui/src/assets/src/icons/primary-nav/home_default.svg'
import homeHover from '@my-repo/ui/src/assets/src/icons/primary-nav/home_hover.svg'
import homeSelected from '@my-repo/ui/src/assets/src/icons/primary-nav/home_selected.svg'
import moneyDefault from '@my-repo/ui/src/assets/src/icons/primary-nav/money_default.svg'
import moneyHover from '@my-repo/ui/src/assets/src/icons/primary-nav/money_hover.svg'
import moneySelected from '@my-repo/ui/src/assets/src/icons/primary-nav/money_selected.svg'
import indexDefault from '@my-repo/ui/src/assets/src/icons/primary-nav/index_default.svg'
import indexHover from '@my-repo/ui/src/assets/src/icons/primary-nav/index_hover.svg'
import indexSelected from '@my-repo/ui/src/assets/src/icons/primary-nav/index_selected.svg'
import sectorDefault from '@my-repo/ui/src/assets/src/icons/primary-nav/sector_default.svg'
import sectorHover from '@my-repo/ui/src/assets/src/icons/primary-nav/sector_hover.svg'
import sectorSelected from '@my-repo/ui/src/assets/src/icons/primary-nav/sector_selected.svg'
import stockDefault from '@my-repo/ui/src/assets/src/icons/primary-nav/stock_default.svg'
import stockHover from '@my-repo/ui/src/assets/src/icons/primary-nav/stock_hover.svg'
import stockSelected from '@my-repo/ui/src/assets/src/icons/primary-nav/stock_selected.svg'
import timeDefault from '@my-repo/ui/src/assets/src/icons/primary-nav/time_default.svg'
import timeHover from '@my-repo/ui/src/assets/src/icons/primary-nav/time_hover.svg'
import timeSelected from '@my-repo/ui/src/assets/src/icons/primary-nav/time_selected.svg'
import type { ScreenNavItem } from '@my-repo/business'

/** 一级导航：首页 / 资金 / 指数 / 板块 / 个股 / 时间（米金主题三态 SVG） */
export const primaryNavItems: ScreenNavItem[] = [
  {
    label: '首页',
    path: '/home',
    icon: homeDefault,
    hoverIcon: homeHover,
    activeIcon: homeSelected
  },
  {
    label: '资金',
    path: '/fund',
    icon: moneyDefault,
    hoverIcon: moneyHover,
    activeIcon: moneySelected
  },
  {
    label: '指数',
    path: '/index',
    icon: indexDefault,
    hoverIcon: indexHover,
    activeIcon: indexSelected
  },
  {
    label: '板块',
    path: '/plate',
    icon: sectorDefault,
    hoverIcon: sectorHover,
    activeIcon: sectorSelected
  },
  {
    label: '个股',
    path: '/stock',
    icon: stockDefault,
    hoverIcon: stockHover,
    activeIcon: stockSelected
  },
  {
    label: '时间',
    path: '/time',
    icon: timeDefault,
    hoverIcon: timeHover,
    activeIcon: timeSelected
  }
]
