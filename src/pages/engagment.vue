<script setup>
import moment from 'moment'
const dataStore = inject('$dataStore')
const entries = computed(()=>dataStore?.gaEntries)
const prodShim = import.meta.env.PROD ? '/godfather-elements-vue3' : ''
const getCache = ()=>{
  fetch(`${prodShim}/gaEntries.json`)
    .then(r=> r.json() )
    .then(r=> dataStore.gaEntries = r )
  fetch(`${prodShim}/gaHistory.json`)
    .then(r=> r.json() )
    .then(r=> dataStore.gaHistory = r )
}
getCache()

const buttonFilters = { entries: '🎟️',wins: '🎁', clams: '🐚' }
const listSort = ref('entries')
const findUser = ref(null)
const maxHours= ref(48)
const cacheDataOn = computed(()=> dataStore?.cacheDataOn ?? true )
const liveDataOn = computed(()=> dataStore?.liveDataOn ?? true )

const gaHistory = computed(()=> dataStore?.gaHistory ?? {} )
const liveLog = inject('$liveLog')

const findWins = u => {
  const h = cacheDataOn.value ? gaHistory.value?.[u] : {}
  const l = liveDataOn.value ? liveLog?.[u] : {}
  const allD = { ...h, ...l }
  return Object.entries(allD)
    .map(w=>w={
      time:w[0], clams:w[1],
      date: moment(w[0],'X').format('YYMMDD'),
      dateStr: moment(w[0],'X').format('HH:mm'),
      hrsAgo: parseInt(moment().diff(moment(w[0],'X'),'hours'),10)
    })
    .filter( w => w.hrsAgo < maxHours.value )
    .sort((a,b)=> a.time>b.time?-1:1 ) // desc
}

const bigHits = 60*60 // 1hr in seconds
const firstTime = computed(()=> Object.values(entries?.value).flat().map(r=>parseInt(r,10)).reduce((a,c)=>a<c?a:c,999999999999999) )
const gamers = computed(()=> { 
  const pLen = Object.entries(entries.value)
    // form objects
    .filter(p=> !findUser.value ? true : 
      p[0]?.toLocaleLowerCase().includes(findUser.value?.toLocaleLowerCase()) )
    .map(p=>p={
      user:p[0],
      hits:p[1].length,
      hitDistance: p[1]
        ?.map((t,ti)=> !ti ? 0 : parseInt(t,10) - parseInt(p[1][ti-1],10) )
        ?.filter(t=>t),
      lastHr: p[1].filter(t => parseInt(t,10) > parseInt(moment().subtract(1,'hour').format('X'),10)),
      wins: findWins(p[0]),
      hitTimes: p[1],
    })
    ?.map(p=>p={...p,
      clams: p.wins?.reduce((a,c)=>a+=c.clams,0),
      arr: p.hitTimes
        // .filter(a => maxHours.value > parseInt(moment().diff( moment(a,'X') ),10)) 
        .map((a,ax)=>a={
          time:a,
          dist:p.hitDistance?.[ax-1],
          date: moment(a,'X').format('YYMMDD'),
          hrsAgo: parseInt(moment().diff(moment(a,'X'),'hours'),10)
        })
        .filter(a => a?.hrsAgo < maxHours?.value),
    })
    ?.map(p=>p={...p,
      bigHits: p.arr.filter(t=>t?.dist>bigHits),
      smallHits: p.arr.filter(t=>t?.dist<=bigHits)
    })
    ?.map(p=>p={...p, 
      hitAvg: Math.round( (p.smallHits.reduce((a,c)=>a+=c,0) / p.smallHits.length)/60 )
    })
    ?.sort((a,b)=>
      listSort?.value == 'entries' ?
        (a?.arr?.length>b?.arr?.length?-1:1)
        : listSort?.value == 'wins' ? 
          (a?.wins?.length > b ?.wins?.length?-1:1)
          : listSort?.value == 'clams' ? 
            (a?.clams > b ?.clams?-1:1)
            : true
    )

  return pLen
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-x-2 gap-y-1 p-2">
    <div class="col-span-full flex flex-row justify-between items-end pt-4">
      <div class="flex flex-row gap-1">
        <div class="opacity-75">💾 since {{ moment().diff( moment(firstTime,'X'), 'hours') }}hrs</div>
        <label class="px-2">
          👁️ last
          <input v-model="maxHours" type="number" min="1" step="12" />
        </label>
        <label class="px-2">
          <input v-model="findUser" type="search" placeholder="🔍 🧑‍🤝‍🧑"/>
        </label>
        <label class="flex flex-row gap-2 items-center">
          sort by:
          <button
            v-for="ico,txt of buttonFilters" :key="txt" 
            :class="listSort == txt ? 'this' : 'that'" @click="listSort=txt"
            v-text="ico" />
        </label>
      </div>
      <label class="text-xs px-3">
        minutes between <b v-text="`!hitsquad`"/> entries
      </label>
    </div>
    <EngPlayer
      v-for="p of gamers" :key="p?.user"
      :p="p" :w="p?.wins"
      :open="gamers?.length<3" />
  </div>
</template>

<style scoped>
 input[type="number"] { @apply w-10 p-0 underline bg-transparent border-0 text-right }
 input[type="search"] { @apply w-32 p-0 underline bg-transparent border-0 }
 input[type="number"]:after { content: 'hrs'; @apply opacity-100 }
 button:hover { @apply opacity-100 }
 .this { @apply scale-150 }
 .that { @apply opacity-50 }
</style>