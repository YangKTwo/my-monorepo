import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.scss'
import router from './router'
import '@my-repo/theme/themes/analysis.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
