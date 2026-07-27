<template>
  <el-table
    class="ui-table"
    :class="[`ui-table--${variant}`]"
    :data="data"
    :size="size"
    :height="height"
    :empty-text="emptyText"
    :border="border"
    :stripe="stripe"
    :row-key="rowKey"
    @selection-change="onSelectionChange"
    @sort-change="onSortChange"
  >
    <template v-for="col in columns" :key="col.key">
      <!-- 多级表头 -->
      <el-table-column
        v-if="col.children?.length"
        :label="col.label"
        :align="col.align || 'center'"
      >
        <el-table-column
          v-for="child in col.children"
          :key="child.key"
          :prop="child.prop || child.key"
          :label="child.label"
          :min-width="child.minWidth"
          :width="child.width"
          :align="child.align || 'center'"
        >
          <template #default="scope">
            <slot :name="child.key" v-bind="scope">
              {{ scope.row[child.prop || child.key] }}
            </slot>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 普通列 -->
      <el-table-column
        v-else
        :prop="col.prop || col.key"
        :label="col.label"
        :min-width="col.minWidth"
        :width="col.width"
        :align="col.align || 'left'"
        :fixed="col.fixed"
        :sortable="col.sortable"
      >
        <template #default="scope">
          <slot :name="col.key" v-bind="scope">
            {{ scope.row[col.prop || col.key] }}
          </slot>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script setup lang="ts">
import type { SortBy, UiTableProps } from './types'

withDefaults(defineProps<UiTableProps>(), {
  data: () => [],
  columns: () => [],
  size: 'default',
  emptyText: '暂无数据',
  border: false,
  stripe: false,
  variant: 'default',
  selected: () => [],
  rowKey: 'id'
})

const emit = defineEmits<{
  'update:selected': [rows: Record<string, any>[]]
  'update:sort': [value: SortBy | null]
  'selection-change': [rows: Record<string, any>[]]
  'sort-change': [payload: { prop: string; order: 'ascending' | 'descending' | null }]
}>()

function onSelectionChange(rows: Record<string, any>[]) {
  emit('update:selected', rows)
  emit('selection-change', rows)
}

function onSortChange(payload: { prop: string; order: 'ascending' | 'descending' | null }) {
  emit('sort-change', payload)
  if (!payload.prop || !payload.order) {
    emit('update:sort', null)
    return
  }
  emit('update:sort', {
    key: payload.prop,
    order: payload.order === 'ascending' ? 'asc' : 'desc'
  })
}
</script>

<style scoped lang="scss">
.ui-table {
  width: 100%;
}

.ui-table--dashboard {
  background: transparent !important;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(157, 255, 254, 0.08);
  --el-table-border-color: rgba(157, 255, 254, 0.28);
  --el-table-text-color: rgba(229, 234, 240, 0.92);
  --el-table-header-text-color: #9dfffe;
  --el-fill-color-blank: transparent;

  &::before,
  &::after {
    display: none !important;
  }

  :deep(.el-table__inner-wrapper::before) {
    display: none !important;
  }

  :deep(.el-table__header-wrapper th.el-table__cell) {
    background: transparent !important;
    border-bottom: 1px solid rgba(157, 255, 254, 0.35) !important;
    font-weight: 600;
    font-size: 12px;
  }

  :deep(.el-table__body-wrapper td.el-table__cell) {
    background: transparent !important;
    border-bottom: 1px solid rgba(157, 255, 254, 0.12) !important;
    font-size: 12px;
  }

  :deep(.el-table__empty-text) {
    color: rgba(229, 234, 240, 0.55);
  }
}
</style>
