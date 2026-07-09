<template>
  <div class="ui-table">
    <el-table
      v-loading="loading"
      :data="data"
      :border="border"
      :stripe="stripe"
      :height="height"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
    >
      <!-- 序号列 -->
      <el-table-column v-if="showIndex" type="index" label="序号" width="60" fixed="left" />

      <!-- 动态列 -->
      <el-table-column
        v-for="col in columns"
        :key="col.key"
        :prop="col.key"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :fixed="col.fixed"
        :sortable="col.sortable"
        :align="col.align || 'left'"
      >
        <template #default="{ row }">
          <slot :name="col.key" :row="row">
            {{ row[col.key] }}
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination" class="ui-table__pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
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
  pageSize: 20,
  pageSizes: () => [10, 20, 50, 100],
  showPagination: true,
  showIndex: false,
  border: true,
  stripe: true,
  height: 'auto'
})

const emit = defineEmits<{
  'update:currentPage': [value: number]
  'update:pageSize': [value: number]
  'update:sort': [value: SortBy]
  'row-click': [row: any]
  'page-change': [page: number]
  'size-change': [size: number]
}>()

const currentPage = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val)
})

const pageSize = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val)
})

const handleSortChange = ({ prop, order }: any) => {
  emit('update:sort', {
    key: prop,
    order: order === 'ascending' ? 'asc' : 'desc'
  })
}

const handleRowClick = (row: any) => {
  emit('row-click', row)
}

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const handleSizeChange = (size: number) => {
  emit('size-change', size)
}
</script>

<style scoped lang="scss">
.ui-table {
  width: 100%;

  &__pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>
