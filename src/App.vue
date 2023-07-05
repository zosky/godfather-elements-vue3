<script setup>
const { elements, savedData } = inject('$getters')
elements.ls() // init data
// init: persistance f/ browserStorage
savedData('ignored')
savedData('have') 
</script>

<template>
  <div class="relative">
    <TopBar class="sticky top-0 z-10 text-white mb-2" />
    <main>
      <router-view />
    </main>
    <AppTour />
  </div>
</template>
