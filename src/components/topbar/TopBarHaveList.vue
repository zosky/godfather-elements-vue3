<script setup>
const dataStore = inject('$dataStore')
const list = computed(()=> dataStore?.haveGames ?? [])
</script>

<template>
  <div v-if="list?.length" class="flex flex-row self-center items-center px-1 opacity-50">
    <HeartOutline />
    <div v-text="list?.length" />
  </div>
</template>