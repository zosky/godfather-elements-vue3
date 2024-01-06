<script setup>
import { HelpCircleOutline, ControllerClassicOutline } from 'mdue'
import TopBarIgnoreList from './TopBarIgnoreList.vue'

const dataStore = inject('$dataStore')
dataStore.konami = localStorage.getItem('konami') // persist
const games = computed(()=>{
  const p = dataStore?.user?.points
  const i = dataStore?.ignoredGames ?? []
  const h = dataStore?.haveGames ?? []
  const G = dataStore?.games?.filter(g=> !i.includes(g._id) && !h.includes(g._id))
  const gamesOn = G?.filter(g=>g.enabled)
  const gamesOff = G?.filter(g=>!g.enabled)
  const gamesOnCan = gamesOn?.filter(g=>g.cost <= p )
  const gamesOffCan = gamesOff?.filter(g=>g.cost <= p )
  return { gamesOnCan, gamesOn, gamesOffCan, gamesOff }
})
const icons = { gamesOnCan: '🎁', gamesOn: '💸', gamesOffCan: '💀', gamesOff: '☠️' }
dataStore.filters = { gamesOn: ref(true), gamesOff: ref(false), gamesOnCan: ref(true), gamesOffCan: ref(false), }
const goTime = u => window.open(u,'elementsPop')
const urls = {
  elementLogo: 'https://cdn.streamelements.com/assets/logos/SE_logo_788x200px_website_side_icon%403x.png',
  elements: 'https://streamelements.com/hitsquadgodfather/store',
  twitch: 'https://www.twitch.tv/hitsquadgodfather',
}
</script>

<template>
  <header class="flex flex-row flex-wrap md:flex-nowrap w-full px-3 bg-purple-950 bg-opacity-75 shadow-sm shadow-purple-500">
    <GodFather
      id="logo" class="colorRotate 
      w-10  mt-2
      md:w-32 md:-mt-3 md:-mb-6 md:-ml-3 md:-mr-5 
      hover:scale-125 hover:translate-x-3 hover:translate-y-6 origin-top-left transition-transform"
      role="button" @click="goTime(urls.twitch)" />
    <img
      id="elementsLink" :src="urls.elementLogo"
      class="pr-2 h-8 self-center hover:scale-110 origin-center transition-transform" role="button"
      @click="goTime(urls.elements)"/>
    <div class="flex flex-row justify-between w-full items-center">
      <button
        v-if="$route.path!='/store'" id="gameList"
        title="gamesList" class="flex flex-row items-center"
        @click="$router.push('/store')">
        <ControllerClassicOutline class="text-4xl" />
        <div v-text="games?.gamesOn?.length ?? ''" />
      </button>
      <template v-else>
        <div class="select-none items-center flex flex-row align-middle place-items-end gap-x-2 " >
          <label
            v-for="(v,k) of games"
            :id="k" :key="k"
            :title="`${v?.length} ${k}`"
            :class="{
              'flex flex-row self-center gap-0.5': true,
              'hidden': !v?.length,
              'opacity-50':!dataStore?.filters?.[k],
            // 'text-xs': !k.includes('Can')
            }">
            <div v-text="!k.includes('Can') ? v?.length- games[`${k}Can`]?.length : v?.length " />
            <div v-text=" icons[k] " />
            <input v-model="dataStore.filters[k]" type="checkbox" class="hidden" />
          </label>
          <TopBarHaveList id="have" @click="$router.push('have')" />
          <TopBarIgnoreList id="ignore" @click="$router.push('ignored')" />
        </div>
        <div class="flex flex-row gap-2">
          <TopBarSort id="sort" />
          <TopBarSearch id="search" />
        </div>
      </template>
      <div class="flex flex-row gap-2 items-center">
        <DataLoader />
        <button class="min-w-max px-1" @click="$router.push('/recentWinners')" v-text="`% pie`" />
        <TopBarEntries />
        <TopBarGAcount id="topNavGA" @click="$router.push('/giveaways')" />
        <MyUser id="user" />
        <h3 id="help" title="(re)start tour"><HelpCircleOutline @click="$tours['myTour'].start()" /></h3>
      </div>
    </div>
  </header>
</template>

<style scoped>
.colorRotate { @apply text-pink-600 ; animation: filter-animation 8s infinite; }
@keyframes filter-animation {
  0% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(100deg); }
  100% { filter: hue-rotate(0deg); }
}
</style>