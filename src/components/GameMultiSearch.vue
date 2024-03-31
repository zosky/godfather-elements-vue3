<script setup>
useHead({ title: 'store' })
const route = useRoute()
const router = useRouter()
const dataStore = inject('$dataStore')
const games = ref( route.params.games?.length ? route.params.games.join('\n') : '')
const allGames = computed(()=>{
  const d = dataStore?.games ?? []
  return d?.map(dd=>dd?.name)
})
const gamesArr = computed(()=>{
  const txt = games.value
  const arr = txt.split('\n')
  if(arr.length) { 
    dataStore.gamesMultiSearch = arr
  }
  return arr
})
watchEffect(()=>{
  const a = allGames?.value
  const r = route?.params?.games
  const s = dataStore?.gamesMultiSearch ?? []
  const routerMatch = r?.filter(g=>a?.includes(g))?.length 
  const matchCount = s.value?.filter(g=>a?.includes(g))?.length
  if (matchCount && routerMatch && (matchCount != routerMatch)) router.push({
    name: '/store/update/[date]/[games]+',
    params: { date: 'todo', games: s }
  })
})
</script>
<template>
  <section>
    <textarea v-if="gamesArr?.length<=1" v-model="games" placeholder="paste list of games here (1 per line)" />
    <div v-else class="w-full grid grid-cols-6">
      <input 
        v-for="(g,ix) of dataStore.gamesMultiSearch" :key="ix" 
        v-model="dataStore.gamesMultiSearch[ix]" 
        class="gameSearch"
        :class="allGames.includes(g) ? 'found':'whoDis'" />
      <button @click="games=''">clear[{{gamesArr.length}}]</button>
    </div>
  </section>
</template>

<style scoped>
section { @apply w-full flex flex-col }
textarea { @apply bg-transparent p-2 ring-1 ring-purple-600 w-full }
.gameSearch { @apply m-1 p-1 rounded-xl px-2 }
.found { @apply bg-purple-950 text-purple-700 font-bold }
.found::before { content: '🔍'; }
.whoDis::before { content: '❓'; }
.whoDis { @apply bg-yellow-900 text-yellow-300 italic }
button { @apply ring ring-purple-950 rounded-xl p-1 m-1 }
</style>