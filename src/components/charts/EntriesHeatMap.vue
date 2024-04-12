<script setup>
import dayjs from 'dayjs'
import apexcharts from 'vue3-apexcharts'
const dataStore = inject('$dataStore')
const liveEntries = inject('$liveEntries')
const entries = computed(()=>dataStore?.gaEntries ?? {})
const entriesPerHour = computed(()=>{
  const e = Object.values(entries.value)?.flat()
  const l = Object.values(liveEntries)?.flat()
  const a = [ ...e, ...l ]
  const newD = a
    ?.reduce((acc,e)=>{
      const h = dayjs.unix(e).format('H')
      const d = dayjs.unix(e).format('YYMMDD')
      const name = dayjs.unix(e).format('Do')
      if (!acc?.[d]) acc[d] = { name, data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] }
      acc[d].data[h] += 1
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
          { from: 10, to: 400, name: 'a few [~200]', color: '#128FD9' },
          { from: 401, to: 700, name: 'a bit [~500]', color: '#00A100' },
          { from: 701, to: 900, name: 'a bunch [~800]', color: '#FFB200' },
          { from: 901, to: 1100, name: 'a lot [~1k]', color: '#FF6200' },
          { from: 1101, to: 10000, name: 'a ton [+1.1k]', color: '#FF0000' }
        ]
      }
    }
  },
  dataLabels: {
    enabled: false,
    // enabledOnSeries: undefined,
    // formatter: function (val, opts) {
    //   return val==0 ? '' : val
    // },      
  },
  xaxis: {
    type: 'category',
    position: 'top',
    categories: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
  },      
}

</script>

<template>

  <apexcharts
    class="w-full"
    height="500"
    :options="heatMapOptions" 
    :series="entriesPerHour"/>

</template>