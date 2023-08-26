<script setup>
import { GiftOutline, CalendarToday } from 'mdue'
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
    .map(w=>w={
      time:w[0], clams:w[1],
      date: moment(w[0],'X').format('YYMMDD'),
      dateStr: moment(w[0],'X').format('HH:mm')
    })
    .filter( w => // apply date filters
      w.time > (props.start ? moment(props.start).format('X') : props.min ) 
      && ( !props.max ? true : w.time < moment(props.max).format('X') )
    )
    .sort((a,b)=> a.time>b.time?-1:1 ) // desc
})
const userPerDay = computed(()=>{
  const userDays = Array.from(new Set(userHistory?.value?.map(u=>u.date)))
  const winsPerDay = userDays.map(d=>d=userHistory?.value.filter(u=>u.date==d))
  const userPDdata = userDays.map((day,x)=> day = { day, 
    wins: winsPerDay[x],
    total: winsPerDay[x].reduce((a,c)=>a+=c.clams,0) })
  return userPDdata
})

</script>

<template>
  <div class="border-l border-purple-700 ml-2 rounded-xl min-w-max">
    <div class="flex flex-row justify-between pl-2 pr-3 bg-white bg-opacity-10 rounded-r-xl gap-2">
      <label class="opacity-90" v-text="user" />
      <h6 :title="`about ${userTTL/userPerDay.length} 🐚s per day\n( ${userTTL}/${userPerDay.length})\n ${userHistory.length} 🎁`" class="text-sm flex flex-row items-center gap-1">
        <div class="text-xs flex flex-row min-w-max items-center gap-1">
          <div class="flex flex-row min-w-max items-center gap-0.5">
            {{ userHistory.length }}<GiftOutline />
          </div>
          <div class="flex flex-row min-w-max items-center gap-0.5">
            ~<Clams :clams="userTTL / userPerDay.length" /><CalendarToday />{{userPerDay.length}} =
          </div>
        </div>
        <Clams :clams="userTTL" class="font-bold" /> 
      </h6>
    </div>
    <!-- <pre>
      {{ userPerDay }}
    </pre> -->
    <details v-for="(day,dx) of userPerDay" :key="day.day" :open="!dx">
      <summary class="flex flex-row justify-between w-full pl-2 pr-4 my-0.5 bg-purple-950 bg-opacity-50 border-b border-purple-600 border-opacity-25 rounded-r-xl">
        <div v-text="moment(day.day,'YYMMDD').format('MMM Do')" />
        <div class="flex flex-row justify-end w-1/2">
          <div class="flex flex-row justify-end items-center text-xs gap-0.5">
            {{ day.wins.length }}
            <GiftOutline />
          </div>
          <Clams :clams="day.total" class="w-12 text-right" />
        </div>
      </summary>
      <div>
        <div 
          v-for="(win, wx) of day.wins" :key="wx"
          class="bg-opacity-50  border-purple-500 flex flex-row justify-between gap-4 items-center w-full pl-3 pr-6 rounded-r-full"
          :class="{
            'border-r bg-purple-900':win.clams==200,
            'border-r bg-purple-700 text-purple-300':win.clams==1000,
            'border-r bg-purple-400 text-purple-200':win.clams==2500,
            'border-b border-opacity-25': win.clams==100
          }">
          <div class="mono text-sm pl-6" v-text="win?.dateStr" />
          <Clams :clams="win?.clams" class="mono font-bold text-lg w-10 text-right" />
        </div>
      </div>      
    </details>
  </div>
</template>