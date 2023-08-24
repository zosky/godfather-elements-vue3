<script setup>
import moment from 'moment'
const liveLog = inject('$liveLog')
const dataStore = inject('$dataStore')
dataStore.search = dataStore?.search ?? null
const listCount = ref(10)
const me = computed(()=> dataStore?.user?.username )
const newWins = computed(()=>{
  const l = Object.entries(liveLog)
  const lr = l?.reduce((a,c)=>{
    const uWins = Object.entries(c?.[1]??{})
    for (const d of uWins) { 
      const user = c[0]
      const win = d?.[0]
      const clams = d?.[1]
      a.push({user,win,clams})
    }
    return a
  },[])
  return lr?.sort((a,b)=>a.win>b.win?-1:1)
    ?? [{ user:'none yet', win: moment().format('X'), clams: 0 }]
})
</script>
<template>
  <div class="flex flex-col items-center w-full mt-3 min-w-max">
    <label class="w-full border-b border-purple-700">
      <input
        v-model="listCount" type="number"
        min="3" :max="newWins.length "
        class="bg-transparent underline border-0 w-20 text-right m-0 p-0" />
      latest winners</label>
    <label
      v-for="(newWin,nx) of newWins?.slice(0,listCount) " :key="nx"
      class="flex flex-row w-full items-center px-2 border-b border-purple-950 rounded-xl"
      :class="{
        'bg-purple-800 text-purple-200 rounded-xl': newWin.user == me,
        'bg-opacity-40 border-pink border-r border-l bg-purple-900':newWin.clams==200,
        'bg-opacity-40 border-pink border-r border-l bg-purple-700 text-purple-300':newWin.clams==1000,
        'bg-opacity-40 border-pink border-r border-l bg-purple-400 text-purple-200':newWin.clams==2500,
      }" >
      <div class="self-center font-mono min-w-max w-1/2 text-xs font-thin text-purple-500 text-right">{{ moment(newWin?.win,'X').format('HH:mm:ss') }}</div>
      <div class="w-full flex flex-row justify-start gap-1">
        <Clams :clams="newWin?.clams" class="w-16 text-right"/>
        <div class="font-bold">{{ newWin?.user }}</div>
      </div>
    </label>
  </div>
</template>