<script setup>
import moment from 'moment'
const liveLog = inject('$liveLog')
const dataStore = inject('$dataStore')
const showTTLs = ref(false)
const showMe = ref(dataStore?.user?.username?true:false)
const me = computed(()=> dataStore?.user?.username )
const gaHistory = computed(()=>dataStore?.gaHistory??{})
const cacheDataOn = computed(()=> dataStore?.cacheDataOn ?? true )
const liveDataOn = computed(()=> dataStore?.liveDataOn ?? true )
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
})

const perDay = computed(()=> 
  Object.values(gaData.value).flat().map(g=> 
    Object.entries(g).map(gg=>{
      const day = moment(gg[0],'X').format('YYMMDD')
      const month = moment(gg[0],'X').format('YYMM')
      const ago = moment().diff(moment(gg[0],'X'),'hours')
      return { x: gg[0], value: gg[1], day, ago, month }
    }))
    ?.flat()
    ?.sort((a,b)=>a.day>b.day?-1:1)
    // ?.filter(g=>g?.ago)
    ?.filter(g=> g.ago < (24 * 30) ) // TODO find ~9k w/o date ?
    ?.reduce((a,c)=>{
      if(!a?.[c.day]) a[c.day]={}
      if(!a?.[c.day]?.[c.value]) a[c.day][c.value]=0
      a[c.day][c.value]++
      return a
    },{})
)
// const monthDays = computed(()=>{
//   const pd = Object.entries(perDay.value)
//     .reduce((a,d)=>{
//       const m = d[0]?.slice(0,4)
//       for (const x of Object.entries(d[1])){
//         if(!a?.[m]) a[m] = {}
//         if(!a?.[m]?.[x[0]]) a[m][x[0]] = 0
//         a[m][x[0]] += x[1]
//       }
//       return a
//     },{})
//   return pd
// })
const allValues = computed(()=>
  Array.from( new Set(
    Object.values(perDay.value)
      ?.map(e=>Object.keys(e)).flat()
      ?.filter(d=>d.match(/(\d\d+)/))
  ))?.sort((a,b)=>parseInt(a,10)>parseInt(b,10)?1:-1)
)
const currency = computed(()=>dataStore?.konami?'money':'clams')
const myWins = computed(()=> Object.entries( gaData.value.find(g=>g[0]==me?.value)?.[1] ?? {} )
  ?.map(gg=>gg={ 
    x: gg[0], 
    value: gg[1], 
    day: moment(gg[0],'X').format('YYMMDD') 
  }).reduce((a,c)=>{
    if(!a?.[c.day]) a[c.day]={}
    if(!a?.[c.day]?.[c.value]) a[c.day][c.value]=0
    a[c.day][c.value]++
    return a
  },{})
)

</script>

<template>
  <div class="overflow-x-scroll scroll-m-0 noScrollbar max-w-full mx-3">
    <div class="flex flex-row gap-2 px-2 justify-start">
      <label v-if="me" :class="{'mine':showMe}">
        {{ showMe ? 'hide':'show ' }} <em>my</em>Ws
        <input v-model="showMe" type="checkbox" name="myWins" class="hidden">
      </label>
      <label>
        {{ showTTLs ? 'hide':'do' }}TheMaths
        <input v-model="showTTLs" type="checkbox" name="showTTLs" class="hidden">
      </label>
    </div>
    <table>
      <tr>
        <th v-text="`📅`" />
        <th>🍕</th>
        <th v-for="v of allValues" :key="v" class="text-right">
          <Clams :clams="v" class="pl-2 min-w-max" :class="currency" />
        </th>      
      </tr>
      <!-- TTL ROW -->
      <tr class="bg-white bg-opacity-30">
        <th class="pl-4" v-text="`${ Object.keys(perDay??{})?.length }`" />
        <th class="flex flex-row w-full justify-end">
          <Clams :clams="Object.values(perDay).map(e=>Object.entries(e).map(ee=>parseInt(ee[0]) * ee[1])).flat().reduce((a,c)=>a+=c,0)" :class="currency" />
        </th>
        <th v-for="v of allValues" :key="v" class="text-right">
          <div
            class="flex flex-row items-center"
            :class=" showTTLs || showMe ?'justify-between' : 'justify-end '">
            <div
              class="flex flex-row w-full items-center gap-1 font-mono text-purple-400"
              :class=" showTTLs ?'justify-between' : 'justify-end '">
              <div v-if="showMe" class="text-xs min-w-max mine" v-text="Object.values(myWins).map(e=>e?.[v]).reduce((a,c)=>a+=c??0,0) || ''" />
              <div class="text-xs x min-w-max" v-text="Object.values(perDay).map(e=>e?.[v]).reduce((a,c)=>a+=c??0,0)" />
              <Clams v-if="showTTLs" :clams="v * Object.values(perDay).map(e=>e?.[v]).reduce((a,c)=>a+=c??0,0)" class="pl-2 min-w-max" :class="currency" />
            </div>
          </div>
        </th>      
      </tr>
      <!-- dayRows -->
      <tr
        v-for="(gas, day) of perDay" :key="day"
        class="hover:bg-purple-900 hover:bg-opacity-40"
        :class="{'bg-purple-900 bg-opacity-30':day.slice(-2)=='01'}">
        <th class="whitespace-nowrap" v-text="moment(day,'YYMMDD').format('MMM Do')" />
        <td class="bg-purple-950 bg-opacity-60 border-b border-purple-900 mr-4">
          <div
            class="flex flex-row justify-between w-full items-center px-2 pr-2 pl-4 font-mono gap-1">
            <div v-if="showMe" class="mine text-xs x" v-text="Object.values(myWins?.[day]??{}).reduce((a,c)=>a+=c,0)" />
            <div class="text-xs x" v-text="Object.values(gas).reduce((a,c)=> a += c, 0 )" />
            <Clams v-if="showMe && myWins?.[day]" :clams="Object.entries(myWins?.[day])?.map(e=>parseInt(e[0],10)*e[1])?.reduce((a,c)=>a+=c,0)" class="mine" :class="currency" />
            <Clams v-else-if="!showMe" :clams="Object.entries(gas)?.reduce((a,c)=> a += parseInt(c[0],10) * c[1] ,0)" :class="currency" class="min-w-max font-bold" />
          </div>
        </td>
        <td
          v-for="v of allValues" :key="v"
          class="w-full justify-between px-2"
          :class="[
            gas?.[v]?'border-r':'border-dashed','border-b border-r',
            showMe && myWins?.[day]?.[v] ? 'bg-purple-950 bg-opacity-40' : ''
          ]">
          <div
            :class=" showTTLs || showMe ?'justify-between' : 'justify-end '"
            class="flex flex-row items-center w-full  gap-1 font-mono">
            <div v-if="showMe" class="text-xs min-w-max text-purple-300" v-text="myWins?.[day]?.[v] ?? ''" />
            <div v-if="gas?.[v]" class="text-xs x min-w-max" v-text="gas?.[v]" />
            <Clams
              v-if="showTTLs && gas?.[v]"  :clams="gas?.[v] * v"
              class="font-bold min-w-max" :class="currency" />
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
th { @apply bg-purple-900 bg-opacity-60 text-purple-700 px-2 text-right }
td { @apply text-right text-sm font-mono border-purple-800 pr-1 }
.x:after{ content: 'x'; @apply opacity-50 }
label { @apply px-2 mb-1 }
label:hover { @apply bg-purple-950 rounded-xl }
.mine { @apply text-purple-300 min-w-max }
</style>