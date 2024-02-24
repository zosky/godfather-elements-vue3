<script setup>
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(advancedFormat)
dayjs.extend(weekOfYear)
const dataStore = inject('$dataStore')
const { cache } = inject('$getters')
const liveRedeem = inject('$liveRedeem')
const liveEntries = inject('$liveEntries')
const liveLog = inject('$liveLog')

const thisWeek = dayjs().format('YYYYww')
const liveArr = computed(()=> Object.values(liveEntries).flat()?.length)
const redeemedGamesThisWeek = computed(()=>{
  const d = dataStore?.[`redeems-${thisWeek}`]?.map(r=>r?.game) ?? []
  const l = liveRedeem?.map(r=>r?.game) ?? []
  const u = Array.from(new Set([...d,...l])).length
  return u
})
const redeemedPeopleThisWeek = computed(()=>{
  const d = dataStore?.[`redeems-${thisWeek}`]?.map(r=>r.user) ?? []
  const l = liveRedeem?.map(r=>r.user) ?? []
  const u = Array.from(new Set([...d,...l])).length
  return u
})

const entriesPeopleThisWeek = computed(()=>{
  const d = Object.keys(dataStore?.[`gaEntries-${thisWeek}`]??{})
  const l = Object.keys(liveEntries??{})
  const u = Array.from(new Set([...d,...l])).length
  return u
})

const giveawaysPeopleThisWeek = computed(()=>{
  const d = Object.keys(dataStore?.[`gaHistory-${thisWeek}`]??{})
  const l = Object.keys(liveLog??{})
  const u = Array.from(new Set([...d,...l])).length
  return u
})

const giveawaysCountThisWeek = computed(()=>{
  const d = Object.values(dataStore?.[`gaHistory-${thisWeek}`]??{}).reduce((a,c)=>a+=Object.keys(c).length,0)
  const l = Object.values(liveLog??{}).reduce((a,c)=>a+=Object.keys(c).length,0)
  const u = d+l
  return u
})

const calmsThisWeek = computed(()=>{
  const d = Object.values(dataStore?.[`gaHistory-${thisWeek}`]??{})
    .map(c => Object.values(c) )
    .flat().reduce((a,c)=>a+=c,0)
  const l = Object.values(liveLog??{})
    .map(c=> Object.values(c) )
    .flat().reduce((a,c)=>a+=c,0)
  return (d??0)+(l??0)
})

const redeemCountThisWeek = computed(()=>{
  const h = dataStore?.[`redeems-${thisWeek}`]?.length ?? 0
  const l = liveRedeem?.length ?? 0
  return h + l
})

const entriesThisWeek = computed(()=>{
  const h = Object.values(dataStore?.[`gaEntries-${thisWeek}`]??{})?.flat()?.length ?? 0
  const l = liveArr.value ?? 0
  return h + l
})

const hashMap = computed(()=>{
  if(dataStore?.hashMap) {
    dataStore.hashMap[thisWeek] = { 
      redeemsGames: redeemedGamesThisWeek?.value,
      redeemsPeople: redeemedPeopleThisWeek?.value,
      redeemsCount: redeemCountThisWeek.value,
      giveawaysPeople: giveawaysPeopleThisWeek?.value,
      giveawaysCount: giveawaysCountThisWeek?.value,
      giveawaysClams: calmsThisWeek?.value,  
      entriesPeople: entriesPeopleThisWeek?.value,
      entriesCount: entriesThisWeek?.value, 
    }}

  const d = Object.entries(dataStore?.hashMap??{})
    ?.map(d=>d={week:d[0],...d[1]})
    ?.sort((a,b)=>a.week>b.week?-1:1)
    ?.filter(f=>!['202301']?.includes(f.week))
  return d
})
cache('hashMap') // getData

const dataFiles = ['gaEntries','gaHistory', 'redeems']
const fields = [ 
  'week',
  'redeemsGames', 'redeemsPeople', 'redeemsCount',
  'giveawaysPeople', 'giveawaysCount', 'giveawaysClams',  
  'entriesPeople', 'entriesCount', 
]
const loadedData = ref({}) // init this week (arr[0] not used)
const isOpen = ref(false) // init this week (arr[0] not used)

loadedData.value[dayjs().format('YYYYww')] = true
loadedData.value[dayjs().subtract(1,'week').format('YYYYww')] = true
loadedData.value[dayjs().subtract(2,'week').format('YYYYww')] = true

const goTime = ()=>{
  // make monkyName array
  const d = Object.entries(loadedData.value)
    .reduce((a,c)=>{if(c[1]) a.push(c[0]);return a},[])
  if(d.length)
    dataStore.loadedData = d
  for (const t of dataFiles){
    dataStore[t] = {} // reset dataPool
    // load each month -> merge
    for(const m of d){
      cache(`${t}-${m}`).then(r=>mergeData(t,r))
    }
    // delete dataStore[t].hitsquadgodfather // TGF is banned from the stats app xD
  }
  // }
}
goTime() // init

const mergeData = (p,r) => {
  if(!dataStore?.[p]) { dataStore[p] = r }
  else if (p=='redeems'){ // merge arrays
    dataStore[p] = [ ...Object.values(dataStore[p]), ...r ]
  }
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
  <section v-if="dataStore?.showWeeks" class="grid grid-cols-10 max-w-full mx-auto">
    <label
      class="col-span-full text-center opacity-75 text-xs"
      :title="`godFather has been giving out calms & games much longer than this,\nthis is what the app can show`">
      recording for {{hashMap?.length}} weeks since {{
        hashMap?.at(-1)?.week ? dayjs()
          .year(hashMap?.at(-1)?.week?.match(/^(....)/)?.[1])
          .week(hashMap?.at(-1)?.week?.match(/(..)$/)?.[1])
          .day(0)
          .format('YYYY MMM Do') : '?' }}
    </label>
    <div v-for="field of ['week','redeems','giveaways','entries']" :key="field" class="num top" :class="field">{{ field }}</div>
    <template v-for="data of hashMap" :key="data.week">
      <label
        v-for="field of fields"
        :key="field" class="num"
        :class="{
          hidden: !isOpen && !loadedData?.[data?.week] ,
          thisWeekSelected: loadedData?.[data.week] && isOpen,
          newMonth: dayjs(data.week,'YYYYww').format('DD') <= 7,
          week: (field=='week' && (isOpen || ( !isOpen && loadedData?.[data.week] )))
        }">
        <template v-if="field=='week'">
          <input
            v-if="isOpen"
            v-model="loadedData[data.week]" type="checkbox"
            @change="goTime()"/>
          <div v-if="dayjs().format('YYYYww')==data.week" class="w-full text-center font-bold">
            thisWeek
          </div>
          <template v-else>
            <div
              class="from" v-text="data.week ? dayjs().year(data.week.match(/^(....)/)?.[1]).week(data.week.match(/(..)$/)?.[1]).day(0).format(
                dayjs(data.week,'YYYYww').format('DD') <= 7 ? 
                  'MMM Do' : 'Do'
              ) : '?'" />
            <div
              class="to" v-text="data.week ? dayjs().year(data.week.match(/^(....)/)?.[1]).week(data.week.match(/(..)$/)?.[1]).day(6).format(
                dayjs(data.week,'YYYYww').add(6,'days').format('DD') <= 7 ?
                  'MMM Do' : 'Do'
              ) : '?' " />
          </template>
        </template>
        <Clams
          v-else-if="data?.[field]" :clams="data?.[field]"
          :title="`${data?.[field]} ${field} on the week of ${dayjs(data.week,'YYYYww').format('MMM DD')}`"
          :class="[field,{
            clams:field=='giveawaysClams',
            people: field.includes('People'),
            number: field.includes('Count'),
            games: field.includes('Games'),
            entries: field.includes('entries'),
            redeems: field.includes('redeems'),
            giveaways: field.includes('giveaways'),
          }]" />
        <div v-else>
          {{  data?.[field] ? field +':':'' }}
          {{  data?.[field] ?? '' }}
        </div>
      </label>
    </template>
    <button class="col-span-full hover:bg-purple-950 bg-opacity-10" @click="isOpen=!isOpen" > 
      smash to {{!isOpen?'show':'hide'}} 
      {{ hashMap.length - Object.values(loadedData).filter(t=>t).length }} more weeks
    </button>
  </section>
</template>

<style scoped>
  .week { @apply col-span-2 flex flex-row w-full items-center px-2 }
  .newMonth { @apply border-b border-purple-800 }
  .from { @apply font-bold w-1/2 text-right }
  .to { @apply font-light w-1/2 text-left }
  .to::before { content: '...' }
  .num:not(.newMonth) { @apply border-b border-opacity-50 border-purple-900 }
  /* .num { @apply flex flex-row justify-end items-center } */
  .people:after { content:'🧑‍🤝‍🧑'; @apply opacity-75 }
  .games:after { content:'👾'; @apply opacity-75 }
  .entries { @apply font-mono bg-purple-950 bg-opacity-40 w-full justify-end text-right px-2 }
  .giveaways { @apply font-mono bg-purple-950 bg-opacity-60 w-full justify-end text-right px-2 }
  .redeems { @apply font-mono bg-purple-700 w-full justify-end text-right text-black px-2 font-bold font-mono }
  .thisWeekSelected .redeems { @apply bg-purple-600 }

  .top.entries { @apply col-span-2 border-r border-purple-950 bg-opacity-50 }
  .top.giveaways { @apply col-span-3 border-b border-purple-950 }
  .top.redeems { @apply col-span-3 }
  .top { @apply px-2 bg-opacity-70 }
  .top.week { @apply justify-center opacity-25 }
  .giveawaysClams { @apply font-bold }
  .thisWeekSelected { @apply text-pink-800 bg-white bg-opacity-10 }
  label { @apply min-w-max }
</style>