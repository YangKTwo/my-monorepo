<template>
  <div class="ui-form">
    <el-form
      ref="formRef"
      :model="formData"
      :label-width="labelWidth"
      :inline="inline"
      :size="size"
    >
      <el-form-item
        v-for="item in config"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :required="item.required"
      >
        <!-- 输入框 -->
        <el-input
          v-if="item.type === 'input'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          clearable
          v-bind="item.attrs"
        />

        <!-- 数字 -->
        <el-input-number
          v-else-if="item.type === 'number'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          v-bind="item.attrs"
        />

        <!-- 下拉选择 -->
        <el-select
          v-else-if="item.type === 'select'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          clearable
          v-bind="item.attrs"
        >
          <el-option
            v-for="opt in item.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>

        <!-- 日期 -->
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          type="date"
          value-format="YYYY-MM-DD"
          v-bind="item.attrs"
        />
      </el-form-item>

      <el-form-item v-if="showActions">
        <el-button type="primary" @click="handleSubmit"> 查询 </el-button>
        <el-button @click="handleReset"> 重置 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormConfig, FormData } from './types'

interface Props {
  config: FormConfig[]
  data?: FormData
  labelWidth?: number | string
  inline?: boolean
  size?: 'large' | 'default' | 'small'
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  labelWidth: 100,
  inline: false,
  size: 'default',
  showActions: true
})

const formRef = ref()
const formData = reactive<FormData>({ ...props.data })

// 监听外部数据变化
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      Object.assign(formData, newData)
    }
  },
  { deep: true }
)

const emit = defineEmits<{
  submit: [data: FormData]
  reset: []
}>()

const handleSubmit = () => {
  emit('submit', { ...formData })
}

const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset')
}

// 暴露方法
defineExpose({
  formData,
  resetFields: () => formRef.value?.resetFields(),
  setFieldsValue: (data: FormData) => Object.assign(formData, data)
})
</script>
