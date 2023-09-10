<script setup>
import moment from 'moment'
const dataStore = inject('$dataStore')
const entries = computed(()=>dataStore?.gaEntries)
const prodShim = import.meta.env.PROD ? '/godfather-elements-vue3' : ''
const getCache = ()=>{
  fetch(`${prodShim}/gaEntries.json`)
    .then(r=> r.json() )
    .then(r=> dataStore.gaEntries = r )
}
getCache()

const bigHits = 60*60 // 1hr in seconds
const firstTime = computed(()=> Object.values(entries?.value).flat().map(r=>parseInt(r,10)).reduce((a,c)=>a<c?a:c,999999999999999) )
const gamers = computed(()=> { 
  const pLen = Object.entries(entries.value).map(p=>p={
    user:p[0],
    hits:p[1].length,
    hitDistance: p[1]
      ?.map((t,ti)=> !ti ? 0 : parseInt(t,10) - parseInt(p[1][ti-1],10) )
      ?.filter(t=>t),
    lastHr: p[1].filter(t => parseInt(t) > parseInt(moment().subtract(1,'hour').format('X'),10))
  })
    ?.map(p=>p={...p,
      bigHits: p.hitDistance.filter(t=>t>bigHits),
      smallHits: p.hitDistance.filter(t=>t<=bigHits)
    })
    ?.map(p=>p={...p, 
      hitAvg: Math.round( (p.smallHits.reduce((a,c)=>a+=c,0) / p.smallHits.length)/60 )
    })
    ?.sort((a,b)=>a.hits>b.hits?-1:1)

  return pLen
})
</script>

<template>
  <div class="grid grid-cols-4 gap-x-2 gap-y-1 p-2">
    <div class="pt-4 col-span-full">since {{ moment().diff( moment(firstTime,'X'), 'hours') }}hrs</div>
    <EngPlayer v-for="p of gamers" :key="p?.user" :p="p" />
  </div>
</template>