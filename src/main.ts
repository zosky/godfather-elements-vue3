import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { createHead } from '@vueuse/head'
import { getters, dataStorage, methods } from './components/DataStore'

const app = createApp(App)
const head = createHead()

const router = createRouter({
  history: createWebHistory(),
})

app.use(router)
app.use(head)
app.provide('$getters', getters) // pump in dataStore chunks
app.provide('$dataStore', dataStorage)
app.provide('$methods', methods)
app.mount(document.body)
