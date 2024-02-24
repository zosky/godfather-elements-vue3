<script setup>
import { CalendarMonth, CalendarWeek } from 'mdue'
const dataStore = inject('$dataStore')
const goTime = () => {
  const v = !dataStore?.showWeeks
  dataStore.showWeeks=v
  localStorage.setItem('showWeeks',v)
}
const lastShowMonth = localStorage.getItem('showWeeks')
dataStore.showWeeks = lastShowMonth == 'true' ? true 
  : lastShowMonth=='false'?false
    :true
</script>

<template>
  <button 
    class="px-3 min-w-max"
    :class="{isOpen:dataStore?.showWeeks}"
    :title="`[${dataStore?.showWeeks?'CLOSE':'OPEN'}] ${dataStore?.loadedData?.length} of ${Object.keys(dataStore.hashMap??{}).length} weeks loaded`"
    @click="goTime()">
    <CalendarWeek v-if="dataStore?.showWeeks"  />
    <CalendarMonth v-else /> 
    {{ dataStore?.loadedData?.length ?? 0 }}
  </button>
</template>

<style scoped>
  .isOpen { @apply text-purple-300 }
</style>