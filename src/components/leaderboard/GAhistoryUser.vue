<script setup>
import moment from 'moment'
const dataStore = inject('$dataStore')
const liveLog = inject('$liveLog')

const props = defineProps({
  user:{ type:String, default: 'zoskyb' },
  start: { type:String, default: null},
  end: { type:String, default: null},
  min: { type:String, default: null},
  max: { type:String, default: null},
})
const cacheDataOn = computed(()=> dataStore?.cacheDataOn ?? true )
const liveDataOn = computed(()=> dataStore?.liveDataOn ?? true )
const gaHistory = computed(()=> dataStore?.gaHistory ?? {} )

const userTTL = computed(()=>Object.values(userHistory?.value??{})?.reduce((a,c)=>a+=c.clams??0,0))
const userHistory = computed(()=>{
  const u = props?.user
  const h = cacheDataOn.value ? gaHistory.value?.[u] : {}
  const l = liveDataOn.value ? liveLog?.[u] : {}
  const allD = { ...h, ...l }
  return Object.entries(allD)
    .map(w=>w={time:w[0], clams:w[1]})
    .filter( w => // apply date filters
      w.time > (props.start ? moment(props.start).format('X') : props.min ) 
      && ( !props.max ? true : w.time < moment(props.max).format('X') )
    )
    .sort((a,b)=> a.time>b.time?-1:1 ) // desc
})

</script>

<template>
  <div class="border-l border-purple-700 ml-2 rounded-xl">
    <div class="flex flex-row justify-between pl-2 pr-6 bg-white bg-opacity-10">
      <label class="opacity-90" v-text="user" />
      <Clams :clams="userTTL" class="font-bold" />
    </div>
    <template v-for="(win, wx) of userHistory" :key="wx">
      <div 
        class="bg-opacity-50  border-purple-500 flex flex-row justify-between gap-4 items-center w-full pl-3 pr-6 rounded-r-full"
        :class="{
          'border-r bg-purple-900':win.clams==200,
          'border-r bg-purple-700 text-purple-300':win.clams==1000,
          'border-r bg-purple-400 text-purple-200':win.clams==2500,
        }">
        <div class="mono text-sm" v-text="moment(win.time,'X').format('MMM Do hh:mm')" />
        <Clams :clams="win.clams" class="mono font-bold text-lg w-10 text-right" />
      </div>
    </template>
  </div>
</template>