<script setup>
import moment from 'moment'
import { CalendarMonth } from 'mdue'
const dataStore = inject('$dataStore')
const { cache } = inject('$getters')

const dataStart = '202308'
const dataFiles = ['gaEntries','gaHistory', 'redeems']
const haveMonths = moment().diff(moment(dataStart, 'YYYYMM'),'months')
const loadedData = ref([null,true]) // init this month (arr[0] not used)

// selection change = merge files
const goTime = ()=>{
  // make monkyName array
  const d = loadedData.value
  const dataON = d.reduce((a,c,ix)=>{
    if(c) a.push(moment().subtract(ix-1,'month').format('YYYYMM'))
    return a
  },[])
  // collect selected
  if(dataON.length){
    for (const t of dataFiles){
      dataStore[t] = {} // reset dataPool
      // load each month -> merge
      for(const m of dataON){
        cache(`${t}-${m}`).then(r=>mergeData(t,r))
      }
      // delete dataStore[t].hitsquadgodfather // TGF is banned from the stats app xD
    }
  }
}
goTime() // init

const mergeData = (p,r) => {
  if(!dataStore?.[p]) { dataStore[p] = r }
  else { 
    for(const u of Object.entries(r)){
      // merge obj(hist) or array (entries)
      if(u[0] != 'hitsquadgodfather') { // tgfBanned :p
        const ua = dataStore?.[p]?.[u[0]]
        const d = ua ? p=='gaHistory' ? {...ua, ...u[1]} : [...ua, ...u[1]] : null
        dataStore[p][u[0]] = ua ? d : u[1] 
      }
    }
  }
}

</script>

<template>
  <details>
    <summary title="dataLoader: select month(s)">
      <CalendarMonth /> 
      <div v-text="loadedData.filter(d=>d)?.length ?? 0"/>
    </summary>
    <section>
      <div>each month selected will download ~9mb of data (once)</div>
      <article v-for="month of haveMonths" :key="month" :class="'m'+ moment().subtract(month-1,'month').format('MM') ">
        <label>
          <input
            v-model="loadedData[month]" type="checkbox"
            @change="goTime" />
          {{ moment().subtract(month-1,'month').format('YYYY MMMM') }}
        </label>
      </article>
    </section>
  </details>
</template>

<style scoped>
  details { @apply relative }
  details[open] summary { @apply text-purple-500 }
  summary { @apply flex flex-row text-xl justify-center items-center gap-1 }
  summary div { @apply font-bold }
  section  { @apply bg-purple-950 bg-opacity-50 p-4 absolute top-6 rounded-xl shadow-md shadow-pink-300 }
  div { @apply italic text-xs min-w-max }
  article.m12 { @apply border-t border-t-purple-800 }
  input { @apply hidden }
  label { @apply transition-all hover:opacity-75 hover:scale-105 }
  label:has(input:checked) { @apply font-bold }
  label:not(:has(input:checked)) { @apply opacity-50 }
</style>