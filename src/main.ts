import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { applyTimeTheme } from './utils/timeTheme.ts'

// 起動時に時間帯テーマを適用
applyTimeTheme()

const app = createApp(App)
app.use(router)
app.mount('#app')
