<script setup>
const dataStore = inject('$dataStore')
const liveLog = inject('$liveLog')
const cacheDataOn = ref(true)
const liveDataOn = ref(true)
const objToArr = arr => Object.values(arr).map(u=>Object.values(u)).flat()
const gaHistory = computed(()=>dataStore?.gaHistory??{})
const historyArr = computed(()=> objToArr(gaHistory.value))
const liveArr = computed(()=> objToArr(liveLog))
const GAdata = computed(()=>{
  const h = []
  if (cacheDataOn.value) h.push(...historyArr.value)
  if (liveDataOn.value) h.push(...liveArr.value)
  return h
})
const myWins = computed(()=>{
  const h = []
  const me = dataStore?.user?.username
  if (me){
    if (cacheDataOn.value) h.push( ... Object.values( gaHistory.value?.[me]??{}) )
    if (liveDataOn.value) h.push( ... Object.values(liveLog.value?.[me]??{}) )
  }
  return h?.reduce((a,c)=>{ if(c) { !a?.[c] ? a[c]=1 : a[c]++ } ; return a},{})
})
const gaStats = computed(()=>{
  const h = GAdata.value
  const GAuniq = Array.from(new Set(h)).sort((a,b)=>a<b?-1:1)
  const GAcounts = GAuniq.map(clams => clams={
    clams,
    count: h.filter(hh=>hh==clams).length,
    mine: myWins.value?.[clams]
  })
  return GAcounts
})
watchEffect(()=>{ const d = cacheDataOn.value ; dataStore.cacheDataOn = d })
watchEffect(()=>{ const d = liveDataOn.value ; liveDataOn.cacheDataOn = d })
</script>

<template>
  <div id="gaStats">
    <div class="flex flex-row w-full items-center gap-3 pb-1">
      <div>
        <b v-text="GAdata?.length" /> giveAways 
      </div> 
      <div class="flex flex-row gap-1 text-sm select-none">
        <label
          id="cacheData"
          title="data in the app (updated daily)"
          :class="{'bg-purple-800 text-purple-300':cacheDataOn}" 
          class="bg-opacity-50 ring-1 py-1 px-2 rounded-lg ring-purple-700 mr-1" >
          cache:<b>{{ historyArr?.length ?? 0 }}</b>
          <input v-model="cacheDataOn" type="checkbox" class="hidden">
        </label>
        <label
          id="liveData"
          title="data from the stream chat"
          :class="{'bg-purple-800 text-purple-300':liveDataOn}" 
          class="bg-opacity-50 ring-1 py-1 px-2 rounded-lg ring-purple-700">
          live:<b>{{ liveArr?.length ?? 0 }}</b>
          <input v-model="liveDataOn" type="checkbox" class="hidden" />
        </label>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-x-3 text-right max-w-max">
      <template v-for="(ga,gx) of gaStats" :key="gx">
        <div class="flex flex-row items-center justify-end w-full bg-purple-950 bg-opacity-40 px-2" >
          <h6 v-if="ga?.mine" :title="`wining ${ga.clams} x ${ga?.mine} times = ${ga.clams * ga.mine}`" class="font-mono flex flex-row justify-end gap-0.5 text-xs  py-1">
            <div class="number" v-text="ga?.mine" />
            🙋
            <div class="percent" v-text="((ga?.mine/ga?.count*10000)/100).toFixed(3)" />
          </h6>
        </div>
        <div class="number font-light" v-text="ga.count" />
        <Clams :clams="ga.clams" :class="dataStore?.konami ? 'money': 'clams'" />
        <b class="percent font-mono" v-text="(Math.round(ga.count/GAdata?.length*10000)/100).toFixed(2)" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.percent:after { @apply pl-1 }
</style>