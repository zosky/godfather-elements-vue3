<script setup>
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
const bigHits = 60*60 // 1hr in seconds
const dataStore = inject('$dataStore')
const me = computed(()=> dataStore?.user?.username )
const entries = computed(()=>dataStore?.gaEntries )
const liveEntries = inject('$liveEntries')

const redeemsLive = inject('$liveRedeem')
const findRedeems = u => {
  const r = Object.values(dataStore.redeems??{})
  const h = r?.filter(r=>r.user==u) ?? []
  const l = redeemsLive?.filter(r=>r.user == u) ?? []
  return [ ...h, ...l ]
}

const myEntries = computed(()=> { 
  let myD = Object.values(entries.value?.[me.value] ?? {})
  if(liveEntries?.[me.value]) myD.push( ... liveEntries[me.value] )
  myD = myD.filter(d=> maxHours.value > parseInt( dayjs().diff(dayjs.unix(d),'hours'), 10) )
  const myHits = { user:me.value, hits:myD.length }
  myHits.hitDistance = myD
    ?.map((t,ti)=> !ti ? 0 : parseInt(t,10) - parseInt(myD[ti-1],10) )
    ?.filter(t=>t)
  myHits.lastHr = myD
    ?.filter(t => parseInt(t) > parseInt(dayjs().subtract(1,'hour').format('X'),10))
  myHits.bigHits = myHits.hitDistance.filter(t=>t>bigHits)
  myHits.smallHits = myHits.hitDistance.filter(t=>t<=bigHits)
  myHits.hitAvg = Math.round( (myHits.smallHits.reduce((a,c)=>a+=c,0) / myHits.smallHits.length)/60 )
  myHits.arr = myD
    .map((time,ax)=>time={
      time,
      dist:myHits.hitDistance?.[ax-1],
      date : dayjs.unix(time).format('YYMMDD'),
    })
  myHits.games = findRedeems(me.value)
  return myHits
})
const maxHours= ref(24)
const liveLog = inject('$liveLog')
const cacheDataOn = computed(()=> dataStore?.cacheDataOn ?? true )
const liveDataOn = computed(()=> dataStore?.liveDataOn ?? true )
const gaHistory = computed(()=> dataStore?.gaHistory ?? {} )
const myWins = computed(()=>{
  const u = me.value
  const h = cacheDataOn.value ? gaHistory.value?.[u] : {}
  const l = liveDataOn.value ? liveLog?.[u] : {}
  const allD = { ...h, ...l }
  return Object.entries(allD)
    .map(w=>w={
      time:w[0], clams:w[1],
      date: dayjs.unix(w[0]).format('YYMMDD'),
      dateStr: dayjs.unix(w[0]).format('HH:mm'),
      hrsAgo: parseInt(dayjs().diff(dayjs.unix(w[0]),'hours'),10)
    })
    .filter( w => w.hrsAgo < maxHours.value )
    .sort((a,b)=> a.time>b.time?-1:1 ) // desc
})

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
      <EngPlayer
        :p="myEntries" :w="myWins"
        class="max-w-prose ml-2" open
        disabled />
    </div>
  </div>
</template>

<style scoped>
 input { @apply w-10 p-0 underline bg-transparent border-0 text-right }
 input:after { content: 'hrs'; @apply opacity-100 }
</style>