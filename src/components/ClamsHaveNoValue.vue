<script setup>
const dataStore = inject('$dataStore')
const close = ref(false)
</script>
<template>
  <div 
    v-if="dataStore?.konami && !close" 
    class="px-3 bg-purple-900 bg-opacity-50 text-center ring-1 shadow-md" @click="close=true"><span class=italic>
      "clams have no real world value"</span>, so 10k🐚 != ~1$💸USD
  </div>
</template>