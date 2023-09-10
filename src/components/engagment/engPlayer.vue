<script setup>
import moment from 'moment'
defineProps({
  p: { type: Object, default: ()=>{return {}}},
  bigHits: { type: Number, default: 60*60 } // 1hr in seconds
})
</script>

<template>
  <details
    class="open:ring-purple-400 open:ring-1 rounded-xl">
    <summary
      class="flex flex-row items-center text-purple-300 w-full"
      :class="{ 
        'ring-1 ring-purple-900 rounded-xl': true,
        'bg-purple-300 rounded-full text-purple-900':p?.user=='Xzoskyb',
        'bg-red-900 rounded-full': !p?.bigHits.length && p?.lastHr?.length,
        'opacity-50': !p?.lastHr?.length
      }">
      <div class="bg-purple-800 opacity-50 rounded-l-full pl-2 pr-1 text-purple-500 w-3/4 flex flex-row justify-between gap-1 items-center">
        <div class="min-w-max font-bold" v-text="`${p?.hits}🎟️`" />
        <div v-if="p?.lastHr.length" class="min-w-max" :class="p?.lastHr.length < 6 ? 'text-purple-500' : 'text-yellow-300'" v-text="`${p?.lastHr.length}${p?.lastHr.length>5?'🔥':'🕐'}`"/>
        <div class="min-w-max" :class="p?.hitAvg < 10 ? 'text-yellow-300 text-sm font-bold': 'text-xs' " v-text="`~${p?.hitAvg}m${p?.hitAvg<10?'🔥':'➰'}`"/>
        <div v-if="p?.bigHits.length" class="min-w-max text-xs " v-text="p?.bigHits.length ? `~${p?.bigHits.length}💤` : ''"/>
        <div v-else-if="!p?.lastHr?.length" class="min-w-max text-xs " v-text="'🐪'"/>
        <div v-else-if="p?.lastHr" class="min-w-max text-xs " v-text="'🤖?'"/>
      </div>
      <div class="pl-1 pr-2 text-xs rounded-r-full w-1/2 mr-0.5">
        <span v-text="p?.user"/>
      </div>
    </summary>
    <div class="text-xs font-mono text-purple-200 break-words flex flex-row flex-wrap items-center justify-center py-1 px-2">
      <div v-for="(h,hx) of p?.hitDistance" :key="hx" :class="{'text-sm opacity-50 bg-white rounded-xl px-2 bg-opacity-30':h>bigHits}">
        {{ Math.round(h/(h>bigHits?60*60:60)) }}{{  h>bigHits ? 'h' :'' }}
        <span v-if="h>bigHits" v-text="'💤'"/>
        <span v-else class="opacity-25" v-text="'🕳️'"/>
        <span v-if="hx +1 == p?.hitDistance?.length " v-text="' [last ' + moment().diff(moment(p.lastHr.at(-1),'X'),'m') + 'm ago]'"  />
      </div>
    </div>
  </details>
</template>

<style scoped>
</style>