import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.globalProperties.$apiHostname = 'http://localhost:3000'
app.config.globalProperties.$loginUrl = app.config.globalProperties.$apiHostname + '/auth/discord'

app.mount('#app')
