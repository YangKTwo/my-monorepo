<template>
  <el-input
    class="ui-input"
    :model-value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :show-password="showPassword"
    :size="size"
    @update:model-value="onUpdate"
    @focus="onFocus"
    @blur="onBlur"
    @keyup.enter="onEnter"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  type?: 'text' | 'password' | 'textarea' | 'number'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  showPassword?: boolean
  size?: 'large' | 'default' | 'small'
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  clearable: false,
  showPassword: false,
  size: 'default'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  enter: [event: KeyboardEvent]
}>()

const onUpdate = (value: string) => emit('update:modelValue', value)
const onFocus = (event: FocusEvent) => emit('focus', event)
const onBlur = (event: FocusEvent) => emit('blur', event)
const onEnter = (event: KeyboardEvent) => emit('enter', event)
</script>

<style scoped>
.ui-input {
  width: 100%;
}
</style>
