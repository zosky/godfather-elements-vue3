<route lang="json">
  {"meta":{"title":"ignored" }}
</route>
<script setup>
const dataStore = inject('$dataStore')
const games = computed(()=>{
  const s = dataStore?.sort ?? 'cost'
  const i = dataStore?.ignoredGames ?? []
  return dataStore?.games
    ?.filter(g=> i.includes(g._id) ) // only ignored
    ?.sort((a,b)=> 
      s=='cost' ? a.cost>b.cost? 1 :-1  
        : s=='date' ? a.updatedAt > b.updatedAt ? 1: -1 
          : s=='name' ? a.name > b.name ? 1 : -1 
            : true)
})
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-2">
    <GameCard v-for="game of games" :key="game._id" :game="game" />
  </div>
</template>