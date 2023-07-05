<script setup>
import { SortAlphabeticalVariant, Calendar, BankOutline } from 'mdue'
const dataStore = inject('$dataStore')
const icons = { 
  cost: BankOutline,
  name: SortAlphabeticalVariant,
  dateModified: Calendar,
}
</script>

<template>
  <div class="flex flex-row gap-2 self-center items-center">
    <label class="opacity-50" v-text="'sort'"/>
    <h3
      v-for="(i,k) of icons" :key="k"
      class="transition-all"
      :class="{'scale-125 text-yellow-400':dataStore.sort==k}"
      :title="k"
      @click="dataStore.sort = k">
      <component :is="i"  />
      <!-- {{ k }} -->
    </h3>
  </div>
</template>