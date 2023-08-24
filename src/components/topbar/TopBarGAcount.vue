<script setup>
import { GiftOutline, ViewListOutline } from 'mdue'
const dataStore = inject('$dataStore')
const liveLog = inject('$liveLog')
const cacheDataOn = ref(true)
const liveDataOn = ref(true)
const objToArr = arr => Object.values(arr).map(u=>Object.values(u)).flat()
const historyArr = computed(()=> objToArr(dataStore?.gaHistory??{}))
const liveArr = computed(()=> objToArr(liveLog))
const gaCount = computed(()=>{
  const h = []
  if (cacheDataOn.value) h.push(...historyArr.value)
  if (liveDataOn.value) h.push(...liveArr.value)
  return h.length
})
</script>

<template>
  <button title="giveAways: live & cached" class="flex flex-row items-center gap-1">
    <ViewListOutline />
    <GiftOutline />
    {{ gaCount ?? 'noneYet' }}
  </button>
</template>