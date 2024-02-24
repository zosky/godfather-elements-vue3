<script setup>
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
const route = useRoute()
const router = useRouter()
const dataStore = inject('$dataStore')
const { cache } = inject('$getters')
const liveLog = inject('$liveLog')
const loopLength = ( import.meta.env.PROD ? 24 : 0.2 ) *60*60*1000 /* DEV|10m PROD:1d */
const getCache = ()=> cache('gaHistory-202401')
  // trim liveLog
  .then(r=>{
    const lastLogEntry = Object.values(r).reduce((a,c)=>{
      const ks = Object.keys(c).map(cc=>parseInt(cc,10))
      for (const k of ks) if (k > a) a = k
      return a
    },1)
    // trim live log
    for ( const u of Object.entries(liveLog) ){
      for (const t of Object.keys(u[1])){
        const n = parseInt(t,10)
        if ( n < lastLogEntry) delete liveLog[u[0]][t]
      }
    }
  })
setInterval(getCache, loopLength ) 
getCache() // init cache

const cacheDataOn = computed(()=> dataStore?.cacheDataOn ?? true )
const liveDataOn = computed(()=> dataStore?.liveDataOn ?? true )

const listCount = ref(20)
const me = computed(()=> dataStore?.user?.username )
const gaHistory = computed(()=>dataStore?.gaHistory??{})
const thisUser = ref({user:route?.params?.user??null})
const userSearch = ref(null)
const gaData = computed(()=>{
  let allData = {} // merged data
  if(cacheDataOn.value && liveDataOn.value){
    allData = { ... gaHistory.value }
    const live = { ... liveLog }
    for (const u of Object.entries(live)){
      if(!allData?.[u[0]]) allData[u[0]] = u[1]
      else allData[u[0]] = { ...allData[u[0]], ...u[1] }
    }
  } else { // only 1 set
    allData = cacheDataOn.value ? gaHistory.value 
      : liveDataOn.value ? liveLog 
        : null
  }
  // goTime
  return Object.entries(allData ?? {})
    ?.filter( u => userSearch?.value? u[0].includes(userSearch.value) : true )
    ?.map(u=>u={
      user: u[0], 
      ttl: Object.entries(u[1])
        .filter(uu=> uu[0] > dayjs(startTime.value??times?.start).format('X') && uu[0] < dayjs(endTime.value??'now').format('X') )
        .reduce((a,c)=>a+=c[1],0),
      count: Object.keys(u[1])
        .filter(uu=> uu > dayjs(startTime.value??times?.start).format('X') && uu < dayjs(endTime.value??'now').format('X') )
        .length
    })
})
const gaTop = computed(()=> gaData.value?.sort((a,b)=>a.ttl>b.ttl?-1:1))
const startTime = ref(null)
const endTime = ref(null)
const times = computed(()=>{ 
  const h = gaHistory.value
  const t = Object.values(h).map(u=>u=Object.keys(u)).flat()
  const tSort = t.sort((a,b)=>a<b?-1:1)
  const start = tSort[0]
  const end = tSort.at(-1)
  return { start, end }
})
watchEffect(()=>{
  const s = times.value?.start
  if (s) startTime.value = dayjs.unix(s).format()
})
watchEffect(()=>{
  const u = thisUser?.value?.user
  const onlyU = gaData?.value.length == 1 
  if ( onlyU && onlyU != u ) thisUser.value = gaData?.value[0]
  router.push(`/giveaways${thisUser?.value?.user?'/' + thisUser?.value?.user: ''}`)
})
</script>

<template>
  <div class="flex flex-row flex-wrap px-4 w-full self-center mx-auto">
    <div
      id="searchDataForUser"
      class="w-full flex flex-row flex-wrap sm:flex-nowrap col-span-2 mt-4 mb-2">
      <div class="flex flex-col">
        <label class="opacity-75" v-text="`from: ${ dayjs.unix(times?.start).format('YY-MM-DD HH:mm') }`" />
        <input
          v-model="startTime"
          type="datetime-local"
          class="m-0 p-0 border-0 bg-transparent" :placeholder="`first known win`" />
      </div>
      <div class="flex flex-col">
        <label class="opacity-75" v-text="`to: now`" />
        <input
          v-model="endTime" type="datetime-local"
          class="m-0 p-0 border-0 bg-transparent" :placeholder="'last known win'" />
      </div>
      <div>
        <input
          v-model="userSearch" type="search"
          :placeholder="`find some1`"
          class="w-32 underline bg-transparent border-0 placeholder:text-purple-700 placeholder:underline">
      </div>
    </div>
    <div
      id="table" class="w-full md:w-1/3">
      <div class="opacity-90 px-4 flex justify-between bg-white bg-opacity-10 w-full">
        <div>
          <input
            v-model="listCount" type="number"
            min="10" :max="gaTop.length"
            class="bg-transparent border-0 underline w-16 text-right m-0 p-0"/> 
          <span class="text-xs" v-text="'top winners'" />
        </div>
        <b v-text="`${ gaTop.length }🧑‍🤝‍🧑`" />
      </div>
      <button
        v-for="(u,ux) of gaTop.slice(0,listCount)"
        :key="ux" 
        class="flex flex-row justify-between gap-2 w-full px-2 w-full"
        :class="{ 
          'animate-pulse': u.user == me,
          'bg-purple-900 text-purple-100': thisUser.user == u.user
        }"
        @click="thisUser=thisUser?.user!=u?.user?u:null" >
        <div class="flex flex-row gap-1">
          <div class="opacity-50 w-6 text-right" v-text="ux+1" />
          <div class="bold" v-text="u.user" />
        </div>
        <div class="flex flex-row gap-1 items-center">
          <Clams :clams="u.ttl" class="bold" />
          <div class="w-6 text-xs" v-text="'x' + u.count" />
        </div>
      </button>
    </div>
    <GAhistoryUser 
      id="userHistory"
      class="w-full md:w-1/3"
      :user="thisUser?.user ?? dataStore?.user?.username ?? gaTop?.[0]?.user" 
      :start="startTime" 
      :end="endTime"
      :min="times.start"
      :max="times.end"/>
  </div>
</template>

<style scoped>
/* width */ #table::-webkit-scrollbar { @apply w-5 }
/* Track */ #table::-webkit-scrollbar-track { @apply shadow-sm shadow-white rounded-full }
/* Handle */ #table::-webkit-scrollbar-thumb { @apply bg-purple-700 border-2 border-purple-400 rounded-full }
</style>