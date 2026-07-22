import type { ScreenToolItem } from '@my-repo/business'
import refreshIcon from '@my-repo/ui/src/assets/src/icons/refresh_default.svg'
import zoomIcon from '@my-repo/ui/src/assets/src/icons/zoomout_default.svg'
import hideIcon from '@my-repo/ui/src/assets/src/icons/hide_default.svg'
import closeIcon from '@my-repo/ui/src/assets/src/icons/close_default.svg'

export const toolbarItems: ScreenToolItem[] = [
  { key: 'refresh', icon: refreshIcon, label: '刷新' },
  { key: 'zoom', icon: zoomIcon, label: '缩放' },
  { key: 'hide', icon: hideIcon, label: '隐藏' },
  { key: 'close', icon: closeIcon, label: '关闭' }
]
