export interface TableColumn {
  key: string
  label: string
  width?: number
  minWidth?: number
  fixed?: 'left' | 'right'
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

export interface SortBy {
  key: string
  order: 'asc' | 'desc'
}
