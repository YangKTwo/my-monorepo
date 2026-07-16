<template>
  <div class="login-form" :class="[`login-form--${variant}`]">
    <h2 class="login-form__title">
      {{ title }}
    </h2>

    <UiForm
      ref="formRef"
      :config="formConfig"
      :data="form"
      :rules="rules"
      :show-actions="false"
      label-width="0"
      size="large"
      @submit="handleSubmit"
    />

    <div class="login-form__action">
      <UiButton
        type="primary"
        size="large"
        :loading="userStore.loginLoading"
        style="width: 100%"
        @click="handleSubmit"
      >
        登 录
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { UiForm, UiButton, type FormConfig, type FormExpose, type FormRules } from '@my-repo/ui'
import { useUserStore } from '@my-repo/stores'
import type { UserInfo } from '@my-repo/apis'

interface Props {
  title?: string
  variant?: 'default' | 'dashboard'
}

withDefaults(defineProps<Props>(), {
  title: '用户登录',
  variant: 'dashboard'
})

const emit = defineEmits<{
  success: [userInfo: UserInfo]
  error: [error: Error]
}>()

const userStore = useUserStore()

const formRef = ref<FormExpose>()
const form = reactive({
  userName: '',
  password: ''
})

const formConfig: FormConfig[] = [
  {
    prop: 'userName',
    type: 'input',
    placeholder: '请输入账号',
    attrs: { clearable: true }
  },
  {
    prop: 'password',
    type: 'password',
    placeholder: '请输入密码'
  }
]

const rules: FormRules = {
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  try {
    const userInfo = await userStore.login({
      userName: String(form.userName),
      userPwd: String(form.password)
    })
    emit('success', userInfo)
  } catch (e: any) {
    emit('error', new Error(e?.message || '登录失败'))
  }
}
</script>

<style scoped lang="scss">
.login-form {
  width: 400px;
  padding: 32px;
  border-radius: 8px;

  &--dashboard {
    background: rgba(0, 52, 98, 0.85);
    border: 1px solid rgba(20, 203, 240, 0.2);
    color: #fff;
  }

  &__title {
    text-align: center;
    margin-bottom: 24px;
    font-size: 20px;
    font-weight: 600;
  }

  &__action {
    margin-top: 8px;
  }
}
</style>
