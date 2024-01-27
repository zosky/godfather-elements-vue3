<script setup>
const dataStore = inject('$dataStore')
const { elements } = inject('$getters')
elements.leaderboard(0) // get 1st page (& _total)
const listMax = computed(()=>dataStore?.leaderboard?._total??21575)
const uRank = computed(()=> dataStore?.user?.rank )
</script>
<template>
  <h6 v-if="uRank" class="w-full p-3 relative pt-10 pb-8" :title="`current rank on the loaderboard = ${uRank}`">
    <label class="absolute left-6 pt-1 text-xs" v-text="`#1`" />
    <label class="absolute right-4 pt-1 text-xs" v-text="`#${Math.round(listMax/1000)}k`"  />
    <div class="w-full rounded-xl ring-1 ring-purple-400 h-6 from-transparent to-purple-950 bg-gradient-to-l" />
    <div :style="`left: ${(uRank/listMax*100)+5}%;`" class="absolute w-24 flex flex-col text-center leading-none items-center -mt-6 opacity-75">
      <div id="youAreHere" class="font-mono font-bold py-1 px-2 rounded-xl bg-purple-800 text-purple-300  mb-1 border-r border-l border-purple-200" v-text="uRank" />
      <div class="text-sm bold" v-text="`you are here`" />
      <div class="text-xs" v-text="`[@${Math.round(uRank/listMax*10000)/100}%]`" />
    </div>
  </h6>
</template>