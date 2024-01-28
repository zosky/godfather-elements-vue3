<script setup>
import moment from 'moment'
const liveRedeem = inject('$liveRedeem')
const dataStore = inject('$dataStore')
const me = computed(()=> dataStore?.user?.username )
const redeems = computed(()=> {
  const allRedeems = []
  if (liveRedeem?.length) allRedeems.push(...liveRedeem)
  if (dataStore?.redeems?.length) allRedeems.push(...dataStore.redeems)
  return allRedeems.sort((a,b)=>a?.time>b?.time?-1:1)
})
const gameNameHashMap = computed(()=>dataStore?.gamesHashMap)
</script>

<template>
  <details open>
    <summary :title="'open/close the recent redeems'">
      <div>recentRedeems</div>
      <!-- <button @click="onlyMine=false" :class="{this:!onlyMine}">all</button> -->
      <!-- <button @click="onlyMine=true" :class="{this:onlyMine}">mine</button> -->
    </summary>
    <section>
      <article v-for="(game,gx) of redeems.slice(0,8)" :key="gx" class="redeem" :class="{me:game.user==me}">
        <GameCard v-if="gameNameHashMap?.[game.game]" :game="gameNameHashMap?.[game.game]" class="gameCard" :controls="false" />
        <h2 v-else v-text="game.game"/>
        <div class="user">
          <h3 v-text="game.user" />
          <h4 :title="moment(game.time,'X').format()" v-text="moment(game.time,'X').format('HH:mm')" />
        </div>
      </article>
    </section>
  </details>
</template>

<style scoped>
  details[open] summary { @apply border-b w-full }
  .me { @apply animate-pulse }
  summary { @apply w-full border-purple-950 opacity-75 rounded-xl py-1 px-4 flex flex-row gap-2 cursor-pointer }
  details:not([open]) > summary > div::before { content: 'show '; }

  summary > label { @apply font-light }
  summary button.this { @apply font-bold }
  section { @apply grid grid-cols-2 xl:grid-cols-8 items-center gap-2 px-3   }
  .redeem { @apply flex flex-col justify-between items-start w-full p-1 }
  .gameCard { @apply w-full }
  .user { @apply w-full flex flex-row justify-between gap-1 p-1 }
  h2 { @apply font-bold min-w-min leading-none }
  h3 { @apply font-light text-sm text-left  }
  h4 { @apply font-extralight text-xs text-left }
  h2::before { content: '👾'; @apply px-1 }
  h3::before { content: '🙋'; @apply px-1 }
  h4::before { content: '📅'; @apply px-1 }
</style>