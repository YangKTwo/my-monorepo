<template>
  <div class="ui-table">
    <table class="ui-table__inner" :class="{ 'is-bordered': border, 'is-striped': stripe }">
      <thead>
        <tr>
          <th v-if="showIndex" class="ui-table__cell" style="width: 60px; text-align: center">
            序号
          </th>
          <th
            v-for="col in columns"
            :key="col.key"
            class="ui-table__cell"
            :style="{
              width: col.width ? col.width + 'px' : 'auto',
              textAlign: col.align || 'left'
            }"
            @click="col.sortable && handleSort(col)"
          >
            {{ col.label }}
            <span v-if="col.sortable" class="ui-table__sort">
              <span
                class="sort-arrow"
                :class="{ active: sortKey === col.key && sortOrder === 'asc' }"
                >▲</span
              >
              <span
                class="sort-arrow"
                :class="{ active: sortKey === col.key && sortOrder === 'desc' }"
                >▼</span
              >
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="row.id || index"
          class="ui-table__row"
          @click="handleRowClick(row)"
        >
          <td v-if="showIndex" class="ui-table__cell" style="text-align: center">
            {{ (currentPage - 1) * pageSize + index + 1 }}
          </td>
          <td
            v-for="col in columns"
            :key="col.key"
            class="ui-table__cell"
            :style="{ textAlign: col.align || 'left' }"
          >
            <!-- 如果有插槽，使用插槽 -->
            <slot :name="col.key" :row="row" :index="index">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="!data || data.length === 0">
          <td :colspan="columns.length + (showIndex ? 1 : 0)" class="ui-table__empty">暂无数据</td>
        </tr>
      </tbody>
    </table>

    <!-- 分页 -->
    <div v-if="showPagination" class="ui-table__pagination">
      <span class="ui-table__total">共 {{ total }} 条</span>
      <div class="ui-table__pagination-controls">
        <button
          class="ui-table__page-btn"
          :disabled="currentPage <= 1"
          @click="handlePageChange(currentPage - 1)"
        >
          上一页
        </button>
        <span class="ui-table__page-info"> 第 {{ currentPage }} / {{ totalPages }} 页 </span>
        <button
          class="ui-table__page-btn"
          :disabled="currentPage >= totalPages"
          @click="handlePageChange(currentPage + 1)"
        >
          下一页
        </button>
        <select
          class="ui-table__page-size"
          :value="pageSize"
          @change="handleSizeChange(Number($event.target.value))"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">{{ size }} 条/页</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TableColumn, SortBy } from './types'

interface Props {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  total?: number
  currentPage?: number
  pageSize?: number
  pageSizes?: number[]
  showPagination?: boolean
  showIndex?: boolean
  border?: boolean
  stripe?: boolean
  height?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  loading: false,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  showPagination: true,
  showIndex: false,
  border: true,
  stripe: true,
  height: 'auto'
})

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:sort', value: SortBy | null): void
  (e: 'row-click', row: any): void
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
}>()

const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc' | ''>('')

const totalPages = computed(() => {
  return Math.ceil((props.total || 0) / props.pageSize)
})

const handleSort = (col: TableColumn) => {
  if (!col.sortable) return

  if (sortKey.value === col.key) {
    if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc'
    } else if (sortOrder.value === 'desc') {
      sortOrder.value = ''
      sortKey.value = ''
    } else {
      sortOrder.value = 'asc'
    }
  } else {
    sortKey.value = col.key
    sortOrder.value = 'asc'
  }

  if (sortKey.value && sortOrder.value) {
    emit('update:sort', {
      key: sortKey.value,
      order: sortOrder.value
    })
  } else {
    emit('update:sort', null)
  }
}

const handleRowClick = (row: any) => {
  emit('row-click', row)
}

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
    emit('page-change', page)
  }
}

const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
  emit('size-change', size)
  // 重置到第一页
  emit('update:currentPage', 1)
  emit('page-change', 1)
}

// 引入 ref
import { ref } from 'vue'
</script>

<style scoped>
.ui-table {
  width: 100%;
  overflow: hidden;
}

.ui-table__inner {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.ui-table__inner.is-bordered {
  border: 1px solid #e5e7eb;
}

.ui-table__inner.is-bordered .ui-table__cell {
  border: 1px solid #e5e7eb;
}

.ui-table__inner.is-striped .ui-table__row:nth-child(even) {
  background: #f9fafb;
}

.ui-table__cell {
  padding: 10px 14px;
  text-align: left;
  color: #333;
}

.ui-table__row {
  cursor: pointer;
  transition: background 0.2s;
}

.ui-table__row:hover {
  background: #f3f4f6;
}

.ui-table__sort {
  display: inline-flex;
  flex-direction: column;
  margin-left: 4px;
  font-size: 10px;
  cursor: pointer;
}

.sort-arrow {
  color: #ccc;
  line-height: 1;
}

.sort-arrow.active {
  color: #4a9eff;
}

.ui-table__empty {
  text-align: center;
  padding: 30px 0;
  color: #999;
}

.ui-table__pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 0 4px;
}

.ui-table__total {
  color: #666;
  font-size: 13px;
}

.ui-table__pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ui-table__page-btn {
  padding: 4px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.ui-table__page-btn:hover:not(:disabled) {
  background: #4a9eff;
  color: #fff;
  border-color: #4a9eff;
}

.ui-table__page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-table__page-info {
  color: #333;
  font-size: 13px;
}

.ui-table__page-size {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  cursor: pointer;
}

.ui-table__page-size:focus {
  border-color: #4a9eff;
}
</style>
