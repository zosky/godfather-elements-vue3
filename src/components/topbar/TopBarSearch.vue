<script setup>
import { ToyBrickSearch, ToyBrickRemove } from 'mdue'
const dataStore = inject('$dataStore')
const showSearch = ref(false)
dataStore.search = null
</script>

<template>
  <label class="self-center flex flex-row items-center mt-1">
    <ToyBrickSearch v-if="!showSearch" role="button" @click="showSearch=true" />
    <ToyBrickRemove v-else role="button" class="z-10" @click="showSearch=false" />
    <input
      v-if="showSearch" v-model="dataStore.search"
      type="search" class="text-xs -ml-6 pl-8 py-0.5 bg-transparent w-40 rounded-xl"
      placeholder="search"  />
  </label>
</template>