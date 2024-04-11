<script setup>
import dayjs from 'dayjs'
import apexcharts from 'vue3-apexcharts'
const dataStore = inject('$dataStore')
// const liveEntries = inject('$liveEntries')
// const entries = computed(()=>dataStore?.gaEntries ?? {})
const liveLog = inject('$liveLog')
const cacheDataOn = computed(()=> dataStore?.cacheDataOn ?? true )
const liveDataOn = computed(()=> dataStore?.liveDataOn ?? true )
const gaHistory = computed(()=> dataStore?.gaHistory ?? {} )
const me = computed(()=> dataStore?.user?.username )

const clamsPerHour = computed(()=>{

  const u = me.value
  const h = cacheDataOn.value ? gaHistory.value?.[u] : {}
  const l = liveDataOn.value ? liveLog?.[u] : {}
  const allD = { ...h, ...l }

  const newD = Object.entries(allD)
    ?.map(w=>w={
      time:w[0], clams:w[1],
      date: dayjs.unix(w[0]).format('YYMMDD'),
      day: dayjs.unix(w[0]).format('Do'),
      hour: dayjs.unix(w[0]).format('H'),
      // x: parseInt( dayjs.unix(w[0]).format('x') ),
      // dateStr: dayjs.unix(w[0]).format('HH:mm'),
      hrsAgo: parseInt(dayjs().diff(dayjs.unix(w[0]),'hours'),10)
    })
    ?.reduce((acc,uu)=>{
      const k = `${uu.day}`
      if (!acc?.[k]) acc[k] = { name: k, data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] }
      acc[k].data[uu.hour] += uu.clams
      return acc
    },{})

  return Object.values(newD)
})
const heatMapOptions = {
  theme: { mode: 'dark' },
  colors: ['#000000','#002FFB','#008FFB'],
  chart: { height: 'auto', type: 'heatmap' },
  plotOptions: {
    heatmap: {      
      shadeIntensity: 0.5,
      radius: 2,
      useFillColorAsStroke: true,
      colorScale: {
        ranges: [
          { from: 0, to: 9, name: ' ', color: '#00000000', dataLabels:{ color:'#00000000'} },
          { from: 10, to: 210, name: 'a few [~200]', color: '#00A100' },
          { from: 211, to: 600, name: 'a bit [~600]', color: '#128FD9' },
          { from: 601, to: 1001, name: 'a bunch [~1k]', color: '#FFB200' },
          { from: 1002, to: 10000, name: 'a ton [1k+]', color: '#FF0000' }
        ]
      }
    }
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: undefined,
    formatter: function (val, opts) {
      return val==0 ? '' : val
    },      
  },
  xaxis: {
    type: 'category',
    position: 'top',
    categories: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
  },      
}

</script>
<template>
  <div class="pt-1">
    <label class="opacity-75">heatMap</label>
    <apexcharts
      class="w-full bg-transparent"
      height="500"
      :options="heatMapOptions" 
      :series="clamsPerHour"/>
  </div>
</template>