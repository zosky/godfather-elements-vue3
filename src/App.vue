<script setup>
const { elements, savedData } = inject('$getters')
const dataStore = inject('$dataStore')
elements.ls() // init data
// init: persistance f/ browserStorage
savedData('ignored')
savedData('have') 
savedData('basket')
const miniModay = computed(() => dataStore?.mini )
</script>

<template>
  <div class="relative">
    <template v-if="!miniModay">
      <TopBar class="sticky top-0 z-10 text-white mb-2" />
      <ClamsHaveNoValue />
      <WeeklyData />
      <MyBasket />
    </template>
    <main>
      <router-view />
    </main>
    <AppTour />
  </div>
</template>
