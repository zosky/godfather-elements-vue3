<route lang="json">
{ "meta": { "title": "Home" }}
</route>

<script setup>
useHead({ title: 'Home' })
const dataStore = inject('$dataStore')
const games = computed(()=>{
  const p = dataStore?.user?.points
  const s = dataStore?.sort ?? 'cost'
  const i = dataStore?.ignoredGames ?? []
  const h = dataStore?.haveGames ?? []
  const f = dataStore?.filters
  const se = dataStore?.search
  return dataStore?.games
    ?.filter(g => // filter:uxToggles + remembered
      ( !p ? g.enabled 
        : (f.gamesOn && g.enabled && g.cost >= p) || 
          (f.gamesOnCan && g.enabled && g.cost <= p) ||
          (f.gamesOff && !g.enabled && g.cost >= p) ||
          (f.gamesOffCan && !g.enabled && g.cost <= p) ) 
        && !i.includes(g._id) && !h.includes(g._id) // not have/ignore
        && ( se?.length ? g.name.toLowerCase().includes(se.toLowerCase()) : true ) 
    ) 
    // ?.filter(g=> !i.includes(g._id) && !h.includes(g._id) ) // not ignored && not have
    ?.sort((a,b)=> 
      s=='cost' ? a.cost>b.cost? 1 :-1  
        : s=='date' ? a.updatedAt > b.updatedAt ? 1: -1 
          : s=='name' ? a.name > b.name ? 1 : -1 
            : true)
})
</script>

<template>
  <section class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 px-2">
    <GameCard v-for="game of games" :key="game._id" :game="game" />
  </section>
</template>
