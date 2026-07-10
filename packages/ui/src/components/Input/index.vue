<template>
  <input
    class="ui-input"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  type?: 'text' | 'password' | 'number' | 'email' | 'tel'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style scoped>
.ui-input {
  padding: 8px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  background: #fff;
  color: #1a1a2e;
  width: 100%;
  min-width: 120px;
}

.ui-input:focus {
  border-color: #4a9eff;
  box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
}

.ui-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f7fa;
}

.ui-input:read-only {
  background: #f5f7fa;
}
</style>
