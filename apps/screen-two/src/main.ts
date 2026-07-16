import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { setupApiConfig } from '@my-repo/apis'
import '@my-repo/theme/themes/dynamic.css'
import '@my-repo/ui'
import './styles/global.scss'
import { createPinia } from 'pinia'

setupApiConfig({
  loginSource: import.meta.env.VITE_APP_KEY || 'dz-ai-sys',
  onUnauthorized: () => {
    if (router.currentRoute.value.name !== 'Login') {
      router.replace({
        name: 'Login',
        query: { redirect: router.currentRoute.value.fullPath }
      })
    }
  }
})
const app = createApp(App)
app.use(createPinia())
app.use(router).use(ElementPlus)
app.mount('#app')
