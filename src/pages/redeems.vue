<script setup>
import moment from 'moment'
const liveRedeem = inject('$liveRedeem')
const dataStore = inject('$dataStore')
const me = 'andreifedorukkz' // computed(()=> dataStore?.user?.username )
const redeems = computed(()=> {
  const allD = [ 
    ...Object.entries(liveRedeem??{}), 
    ...Object.entries(dataStore?.redeems??{})
  ]
  const reducedD = allD?.reduce((a,c)=>{
    for (const g of Object.entries(c[1])){
      if (!a?.[g[1]]) a[g[1]] = {}
      a[g[1]][g[0]] = c[0]
    }
    return a
  },{})
  const finalD = Object.entries(reducedD).map((g)=>g={name:g[0],data:g[1], count: Object.keys(g[1]).length})
  return finalD.sort((a,b)=>a.count<b.count?1:-1)
})

const gameNameHashMap = computed(()=>
  dataStore?.games?.reduce((a,c)=>{
    a[c.name] = c
    return a
  },{})
)

</script>

<template>
  <section>
    <details v-for="game of redeems" :key="game?.name">
      <summary>
        <GameCard v-if="gameNameHashMap?.[game?.name]" :game="gameNameHashMap?.[game?.name]" class="gameCard" :controls="false" />
        <div v-else>{{ game?.name }}</div>
        <div class="count" :class="{me:Object.values(game?.data??{})?.includes(me)}" v-text="game?.count" />
      </summary>
      <ul>
        <li v-for="(user, date) of game?.data" :key="date">
          <span class="font-light" v-text="moment(date,'X').format('MMM DD HH:MM')" />
          <b v-text="user" />
        </li>
      </ul>
    </details>
  </section>
</template>

<style scoped>
  section { @apply grid grid-cols-5 gap-1 p-2 }
  summary { @apply relative list-none }
  summary .count { @apply absolute top-0 right-0 px-2 p-1 rounded-xl bg-opacity-75 bg-purple-900 text-yellow-300 font-bold }
  summary .count::before{ content: '#' ; @apply font-light }
  .count.me::after{ content: '🙋'}
  ul { @apply p-1 flex flex-col-reverse }
  b { @apply px-1 }
</style>