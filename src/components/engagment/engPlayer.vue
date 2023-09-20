<script setup>
import { SwordCross, Upload, Download, CommentQuestion } from 'mdue'
import moment from 'moment'
const props = defineProps({
  p: { type: Object, default: ()=>{return {}}},
  w: { type: Object, default: ()=>{return []}},
  bigHits: { type: Number, default: 60*60 } // 1hr in seconds
})
const allD = computed(()=>{
  const newD = []
  if (props?.p?.arr?.length) newD.push(...props.p.arr)
  if (props?.w?.length) newD.push(...props.w)
  return newD?.sort((a,b)=>a.time<b.time?-1:1)
})
const hits = computed(()=>{
  const d = allD.value?.map(d=>d=d?.dist)?.filter(t=>t)
  const big = d?.filter( t => t > props.bigHits )
  const small = d?.filter( t => t <= props.bigHits )
  return { big, small, d }
})
const smallHitAvg = computed(()=>{
  const g = hits.value?.small ?? []
  const hitAvg = Math.round( (g?.reduce((a,c)=>a+=c,0) / g?.length)/60 )
  return hitAvg
})
const clamMap = { showdownWin: 300, showdownLose: 150, trivia: 250 }
const gameIcons = { showdownWin: Upload, showdownLose: Download, trivia: CommentQuestion }
const myParticipation = computed(()=>Object.entries(clamMap)
  .reduce((a,c)=>{ a[c[0]] = props.w?.filter(ww=>ww.clams==c[1]).length; return a },{}))
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
        <div class="min-w-max" :class="smallHitAvg < 10 ? 'text-yellow-300 text-sm font-bold': 'text-xs' " v-text="`~${smallHitAvg}m${smallHitAvg<10?'🔥':'➰'}`"/>
        <div v-if="hits?.big?.length" class="min-w-max text-xs " v-text="hits?.big?.length ? `~${hits?.big?.length}💤` : ''"/>
        <div v-else-if="!p?.lastHr?.length" class="min-w-max text-xs " v-text="'🐪'"/>
        <div v-else-if="p?.lastHr" class="min-w-max text-xs " v-text="'🤖?'"/>
      </div>
      <div class="pl-1 pr-2 text-xs rounded-r-full w-1/2 mr-0.5">
        <span v-text="p?.user"/>
      </div>
      <div class="flex flex-row justify-evenly gap-1 w-1/3 px-2">
        <div class="flex flex-row items-center min-w-min gap-2">
          <h6
            v-if="myParticipation?.trivia" 
            :title="`triviaWins:${myParticipation?.trivia} x ${clamMap.trivia} = ${myParticipation?.trivia * clamMap.trivia}`" 
            class="flex flex-row items-center min-w-min">
            <span v-text="myParticipation?.trivia" />
            <component :is="gameIcons.trivia" />
          </h6>
          <h6
            v-if="myParticipation?.showdownLose || myParticipation?.showdownWin" class="flex flex-row items-center"
            :title="`wins: ${myParticipation?.showdownWin} / loses: ${myParticipation?.showdownLose}` " >
            <div v-text="myParticipation?.showdownLose + myParticipation?.showdownWin" />
            <SwordCross />
            <SvgPie
              :n="myParticipation?.showdownWin" :d="myParticipation?.showdownLose + myParticipation?.showdownWin"
              :color="myParticipation?.showdownWin > myParticipation?.showdownLose ? '#BF40BF' : 'purple' "  
              :bg-color="myParticipation?.showdownWin >= myParticipation?.showdownLose ? 'purple' : 'red'" />
          </h6>
          <span v-if="w.length" class="min-w-max">{{ w.length }}🎁 </span>
          <Clams v-if="w.length" :clams="w.reduce((a,c)=>a+=c.clams,0)" class="clams min-w-max" />
        </div>
      </div>
    </summary>
    <div class="text-xs font-mono text-purple-200 break-words flex flex-row flex-wrap items-center justify-center py-1 px-2">
      <template v-for="(h,hx) of allD" :key="hx">
        <div
          v-if="h?.date != allD?.[hx-1]?.date" class="w-full border-t border-purple-900 pt-1 opacity-50"
          v-text="moment(h?.date,'YYMMDD').format('MMM Do')" />
        <label 
          v-if="h?.dist" 
          :title="`!hitsquad @ ${moment(h.time,'X').format('HH:mm')}`" :class="{'text-sm opacity-50 bg-white rounded-xl px-2 bg-opacity-30':h?.dist>bigHits}">
          <span v-text="(h.dist/(h.dist>bigHits?60*60:60)).toFixed(h.dist>bigHits?1:0) + (h.dist>bigHits ? 'h' :'')" />
          <span v-if="h.dist>bigHits" v-text="'💤'"/>
          <span v-else class="opacity-25" v-text="'🕳️'"/>
        </label>
        <template v-else-if="h?.clams">
          <label :title="`+${h.clams}🐚 @ ${moment(h.time,'X').format('HH:mm')}`" class="bg-purple-900 bg-opacity-60 rounded-xl pl-2 pr-1">
            <Clams :clams="h?.clams" class="clams" />
          </label>
        </template>
        <span v-else class="opacity-50" >f/~{{ moment(h.time,'X').fromNow() }}</span>
      </template>
    </div>
  </details>
</template>

<style scoped>
</style>