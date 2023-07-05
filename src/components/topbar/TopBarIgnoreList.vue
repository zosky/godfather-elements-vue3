<script setup>
const dataStore = inject('$dataStore')
const ignoreList = computed(()=> dataStore?.ignoredGames ?? [])
</script>

<template>
  <div v-if="ignoreList?.length" class="flex flex-row self-center items-center px-1 opacity-50">
    <EyeOff />
    <div v-text="ignoreList?.length" />
  </div>
</template>