<script setup>
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
import apexcharts from 'vue3-apexcharts'
const dataStore = inject('$dataStore')
const liveLog = inject('$liveLog')
const maxHours= ref(24*7)
const cacheDataOn = computed(()=> dataStore?.cacheDataOn ?? true )
const liveDataOn = computed(()=> dataStore?.liveDataOn ?? true )
const gaHistory = computed(()=> dataStore?.gaHistory ?? {} )

const getCache = ()=>{
  const prodShim = import.meta.env.PROD ? '/godfather-elements-vue3' : ''
  if(!dataStore?.gaEntries) fetch(`${prodShim}/gaEntries.json`)
    .then(r=> r.json() )
    .then(r=> dataStore.gaEntries = r )
  if(!dataStore?.gaHistory) fetch(`${prodShim}/gaHistory.json`)
    .then(r=> r.json() )
    .then(r=> dataStore.gaHistory = r )
}
getCache()

const pieData = computed(()=>topUsers.value?.map(u=>u.clams)??[])
const pieLabels = computed(()=>topUsers.value?.map(u=>u.name)??[])
const pieChart = computed(()=>{ 
  return {
    chart: { type: 'donut', foreColor: '#fff', },
    theme: { monochrome: { enabled: true } },    
    labels: pieLabels.value,
    plotOptions: { 
      pie: { 
        startAngle: 0, endAngle: 360,
        donut: {
          labels: { 
            show: true,
          } 
        },
      },
    },
    dataLabels: { 
      style: { fontSize: '10pt', fontWeight: 'bold'} ,
      background: { enabled: true, foreColor: '#02f', borderRadius:2, padding:1, opacity:0.9, borderWidth:1, border:'#07f' },
      formatter: function(val,opt){
        const l = opt.w.globals.labels[opt.seriesIndex]
        const v = val.toFixed(0)
        return `${l}: ${v}%`
      }
    },
    fill: { type: 'gradient', },
    legend: { 
      colors: 'white', // TEXT COLOR CAN BE CHANGED HERE
      useSeriesColors: false,
      formatter: function(val, opts) {
        return opts.w.globals.series[opts.seriesIndex] + ':' + val
      }
    },
    title: { text: `last ${(maxHours.value/24).toFixed(0)} days: top ${playerCount.value} 🐚 chukkers of ${allUsers.value?.length}🧑‍🤝‍🧑` },
  }
})


const allUsers = computed(()=>{
  const h = cacheDataOn.value ? Object.keys(gaHistory.value??{}) : []
  const l = liveDataOn.value ? Object.keys(liveLog??{}) : []
  const allU = Array.from(new Set([...h, ...l]))
  return allU
    ?.map(u=> u={name:u, clams:findWins(u)?.reduce((a,c)=>a+=c.clams,0)})
    ?.sort((a,b)=>a.clams>b.clams?-1:1)
})

const playerCount = ref(30)
const topUsers = computed(()=>{
  const slicePoint = playerCount.value
  const allWs = allUsers.value ?? []
  const topU = allWs?.slice(0,slicePoint)
  const restU = { name: `${allWs.length-slicePoint}🧑‍🤝‍🧑`, clams: allWs?.slice(slicePoint).reduce((a,c)=>a+=c.clams,0) }
  return topU.length ? [ ...topU, restU ] : []
})

const findWins = u => {
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
}

</script>

<template>
  <div>
    <div class="flex flex-col w-full pt-30 p-3">
      <div class="px-3 bg-purple-950">
        <label>
          last <input v-model="maxHours" type="number" />hours
        </label>
        <label>
          <input v-model="playerCount" type="number" />players
        </label>
      </div>
      <apexcharts :options="pieChart" :series="pieData" class="w-full" />
    </div>
  </div>
</template>

<style scoped>
input { @apply bg-transparent text-purple-500 underline w-16 border-0 p-0 text-right }
</style>