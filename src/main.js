import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import api from './plugins/InfightApi'

import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.globalProperties.$apiHostname = import.meta.env.VITE_API_BASE_URL
app.config.globalProperties.$loginUrl = app.config.globalProperties.$apiHostname + '/auth/discord'

app.use(api)
app.use(Toast, {})
app.use(FloatingVue)

app.mount('#app')
