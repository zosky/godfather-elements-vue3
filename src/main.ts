import { createApp } from 'vue'
import './css/tailwind.css'
import './css/vue3tour.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { createHead } from '@vueuse/head'
import { getters, dataStorage, methods } from './components/DataStore'
import { liveLog, liveEntries, liveRedeem } from './components/twitchIRC'
import Vue3Tour from 'vue3-tour'
import VueApexCharts from 'vue3-apexcharts'
import KonamiCode from 'vue3-konami-code'

const app = createApp(App)
const head = createHead()

const router = createRouter({
  history: createWebHistory(),
})

app.use(router)
app.use(head)
app.use(Vue3Tour)
app.use(VueApexCharts)
app.use(KonamiCode, {onKonamiCodeEntered: methods.KonamiCode })
app.provide('$getters', getters) // pump in dataStore chunks
app.provide('$dataStore', dataStorage)
app.provide('$methods', methods)
app.provide('$liveLog', liveLog)
app.provide('$liveEntries', liveEntries)
app.provide('$liveRedeem', liveRedeem)
// fireBase modules
app.provide('$getData',getData)
app.provide('$rDoc',rDoc)
app.provide('$qData',qData)
app.provide('$fData',fData)
// goTime
app.mount(document.body)
