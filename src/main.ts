import { createApp } from 'vue'
import './css/tailwind.css'
import './css/vue3tour.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { createHead } from '@vueuse/head'
import { getters, dataStorage, methods } from './components/DataStore'
import Vue3Tour from 'vue3-tour'

const app = createApp(App)
const head = createHead()

const router = createRouter({
  history: createWebHistory(),
})

app.use(router)
app.use(head)
app.use(Vue3Tour)
app.provide('$getters', getters) // pump in dataStore chunks
app.provide('$dataStore', dataStorage)
app.provide('$methods', methods)
app.mount(document.body)
