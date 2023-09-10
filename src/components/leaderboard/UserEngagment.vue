<script setup>
import moment from 'moment'

const prodShim = import.meta.env.PROD ? '/godfather-elements-vue3' : ''
const bigHits = 60*60 // 1hr in seconds
const dataStore = inject('$dataStore')
const me = computed(()=> dataStore?.user?.username )
const entries = computed(()=>dataStore?.gaEntries )
const liveEntries = inject('$liveEntries')

const getCache = ()=>{
  if(!dataStore?.gaEntries)
    fetch(`${prodShim}/gaEntries.json`)
      .then(r=> r.json() )
      .then(r=> dataStore.gaEntries = r )
}
getCache()

const myEntries = computed(()=> { 
  let myD = Object.values(entries.value?.[me.value] ?? {})
  if(liveEntries?.[me.value]) myD.push( ... liveEntries[me.value] )
  myD = myD.filter(d=> maxHours.value > parseInt( moment().diff(moment(d,'X'),'hours'), 10) )
  const myHits = { user:me.value, hits:myD.length }
  myHits.hitDistance = myD
    ?.map((t,ti)=> !ti ? 0 : parseInt(t,10) - parseInt(myD[ti-1],10) )
    ?.filter(t=>t)
  myHits.lastHr = myD
    ?.filter(t => parseInt(t) > parseInt(moment().subtract(1,'hour').format('X'),10))
  myHits.bigHits = myHits.hitDistance.filter(t=>t>bigHits)
  myHits.smallHits = myHits.hitDistance.filter(t=>t<=bigHits)
  myHits.hitAvg = Math.round( (myHits.smallHits.reduce((a,c)=>a+=c,0) / myHits.smallHits.length)/60 )
  return myHits
})
const maxHours= ref(24)
</script>

<template>
  <div class="">
    <div class="flex flex-row justify-between items-end">
      <label class="px-2">
        <input v-model="maxHours" type="number" min="1" />
        hours
      </label>
      <label class="text-xs px-3">
        minutes between <b v-text="`!hitsquad`"/> entries
      </label>
    </div>
    <div class="m-2">
      <EngPlayer :p="myEntries" class="max-w-prose ml-2" open disabled />
    </div>
  </div>
</template>

<style scoped>
 input { @apply w-10 p-0 underline bg-transparent border-0 text-right }
 input:after { content: 'hrs'; @apply opacity-100 }
</style>