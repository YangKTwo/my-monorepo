<template>
  <div class="ui-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="mergedRules"
      :label-width="labelWidth"
      :inline="inline"
      :size="size"
      @submit.prevent
    >
      <el-form-item
        v-for="item in config"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :required="item.required"
      >
        <!-- 文本 -->
        <el-input
          v-if="item.type === 'input'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          clearable
          v-bind="item.attrs"
        />

        <!-- 密码 -->
        <el-input
          v-else-if="item.type === 'password'"
          v-model="formData[item.prop]"
          type="password"
          show-password
          :placeholder="item.placeholder"
          clearable
          v-bind="item.attrs"
          @keyup.enter="handleSubmit"
        />

        <!-- 数字 -->
        <el-input-number
          v-else-if="item.type === 'number'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          v-bind="item.attrs"
        />

        <!-- 下拉 -->
        <el-select
          v-else-if="item.type === 'select'"
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          clearable
          v-bind="item.attrs"
        >
          <el-option
            v-for="opt in item.options"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>

        <!-- 日期 -->
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="formData[item.prop]"
          type="date"
          value-format="YYYY-MM-DD"
          :placeholder="item.placeholder"
          v-bind="item.attrs"
        />
      </el-form-item>

      <el-form-item v-if="showActions">
        <el-button type="primary" @click="handleSubmit">
          {{ actionText.submit || '查询' }}
        </el-button>
        <el-button @click="handleReset">
          {{ actionText.reset || '重置' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import type { FormActionText, FormConfig, FormData, FormExpose, FormRules } from './types'

interface Props {
  config: FormConfig[]
  data?: FormData
  rules?: FormRules
  labelWidth?: number | string
  inline?: boolean
  size?: 'large' | 'default' | 'small'
  /** 是否显示默认提交/重置（登录场景设为 false） */
  showActions?: boolean
  actionText?: FormActionText
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  rules: () => ({}),
  labelWidth: 100,
  inline: false,
  size: 'default',
  showActions: true,
  actionText: () => ({})
})

const emit = defineEmits<{
  submit: [data: FormData]
  reset: []
}>()

const formRef = ref<FormInstance>()
const formData = reactive<FormData>({ ...props.data })

watch(
  () => props.data,
  (newData) => {
    if (newData) Object.assign(formData, newData)
  },
  { deep: true }
)

/** 外层 rules + 字段 config.rules 合并 */
const mergedRules = computed(() => {
  const result: FormRules = { ...props.rules }
  props.config.forEach((item) => {
    if (item.rules?.length) {
      result[item.prop] = item.rules
    } else if (item.required && !result[item.prop]) {
      result[item.prop] = [
        {
          required: true,
          message: `请输入${item.label || item.prop}`,
          trigger: 'blur'
        }
      ]
    }
  })
  return result
})

const handleSubmit = async () => {
  const ok = await validate()
  if (!ok) return
  emit('submit', { ...formData })
}

const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset')
}

const validate = async (): Promise<boolean> => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

const resetFields = () => formRef.value?.resetFields()

const setFieldsValue = (data: FormData) => Object.assign(formData, data)

const getFieldsValue = (): FormData => ({ ...formData })

defineExpose<FormExpose>({
  validate,
  resetFields,
  setFieldsValue,
  getFieldsValue
})
</script>

<style scoped>
.ui-form {
  width: 100%;
}
</style>
