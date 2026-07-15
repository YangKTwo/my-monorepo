import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.scss'
import router from './router'
import '@my-repo/theme/themes/analysis.css'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
