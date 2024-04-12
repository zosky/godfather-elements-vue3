<script setup>
import dayjs from 'dayjs'
import apexcharts from 'vue3-apexcharts'
const dataStore = inject('$dataStore')

const liveRedeems = inject('$liveRedeem')
const redeems = computed(()=>Object.values(dataStore?.redeems??{})?.map(e=>e.time/1000).flat())


const redeemsPerHour = computed(()=>{
  const e = Object.values(redeems.value)
  const l = Object.values(liveRedeems)?.map(r=>r.time/1000)?.flat()
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
          { from: -1, to: 0, name: ' ', color: '#00000000', dataLabels:{ color:'#00000000'} },
          { from: 1, to: 9, name: 'a few [~5]', color: '#928FD9' },
          { from: 10, to: 15, name: 'a bit [~12]', color: '#00A100' },
          { from: 16, to: 25, name: 'a bunch [~20]', color: '#FFB200' },
          { from: 26, to: 39, name: 'a lot [~30]', color: '#FF6200' },
          { from: 40, to: 10000, name: 'a ton [+40]', color: '#FF0000' }
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
    :series="redeemsPerHour"/>

</template>