<script setup>
import { ContentCopy } from 'mdue'
const dataStore = inject('$dataStore')
defineProps({game:{type:Object,default:()=>{return {}}}})
const p = computed(()=> dataStore?.user?.points )
const ignore = id => {
  const iList = dataStore?.ignoredGames ?? []
  const isIgnored = iList.includes(id)
  if (isIgnored) dataStore.ignoredGames = iList.filter(g=>g!=id)
  else if (dataStore?.ignoredGames?.length) dataStore.ignoredGames.push(id)
  else dataStore.ignoredGames = [id]
  localStorage.setItem('ignored', JSON.stringify(dataStore.ignoredGames))
}
const have = id => {
  const iList = dataStore?.haveGames ?? []
  const haveIt = iList.includes(id)
  if (haveIt) dataStore.haveGames = iList.filter(g=>g!=id)
  else if (dataStore?.haveGames?.length) dataStore.haveGames.push(id)
  else dataStore.haveGames = [id]
  localStorage.setItem('have', JSON.stringify(dataStore.haveGames))
}
const goSteam = n => `https://store.steampowered.com/search/?term=${encodeURIComponent(n)}`
</script>

<template>

  <article
    class="game rounded-xl relative shadow-sm aspect-2 flex"
    :class="[ 
      !p || p >= game.cost ? 'can shadow-pink-400' : ' shadow-red-500 ring-1 ring-yellow-400 ',
      { 'opacity-25 hover:opacity-100':!game.enabled || !game?.quantity?.current }
    ]">
    <img :src="game?.alert?.graphics?.src" :alt="game?.name" class="aspect-2 rounded-xl" >
    <div class="flex flex-col absolute bottom-0 rounded-b-xl bg-opacity-80 w-full">
      <div class="text-lg items-end flex flex-row justify-end px-2 w-full">
        <EyeOff class="btn" role="button" @click="ignore(game._id)"/>
        <HeartOutline class="btn" role="button" @click="have(game._id)"/>
      </div>
      <div
        class="flex flex-row justify-between items-center pl-0 pr-2 w-full rounded-b-xl bg-opacity-90"
        :class="!p || p >= game.cost ? 'bg-purple-900 text-yellow-400' : 'bg-yellow-300 text-red-600'">
        <div class="flex flex-row gap-1 items-center">
          <a
            v-if="game?.description?.toLowerCase()?.includes('steam')" id="steamSearch"
            :title="`searchSteam:${game.name}`" 
            :href="goSteam(game.name)"
            target="steam">
            <Steam class="h-6 w-6 -mt-4 -mb-3" />
          </a>
          <h2 v-else :title="game?.description" v-text="'⛔'" />
          <div class="text-xs leading-none" v-text="game?.name" />
        </div>
        <div class="flex flex-row gap-1 items-center">
          <div 
            id="quantity"
            class="flex flex-row text-xs self-center items-center"
            :class="game?.quantity?.current<3?'animate-pulse':'opacity-75'">
            <div v-text="game?.quantity?.current" />
            <ContentCopy />
          </div>
          <Clams 
            id="cost" 
            :clams="game.cost" 
            :class="dataStore?.konami?'money':'clams'" 
            class="font-bold text-right justify-end min-w-max" />
          <SvgPie v-if="p < game.cost" :n="p" :d="game?.cost" />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.btn { @apply hover:scale-110 hover:opacity-100 hover:text-yellow-400 transition-all opacity-60 }
</style>