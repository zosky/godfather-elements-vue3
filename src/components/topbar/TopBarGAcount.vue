<script setup>
import { GiftOutline, CodeJson, Twitch } from 'mdue'
const dataStore = inject('$dataStore')
const liveLog = inject('$liveLog')
const cacheDataOn = ref(true)
const liveDataOn = ref(true)
const objToArr = arr => Object.values(arr).map(u=>Object.values(u)).flat()
const historyArr = computed(()=> objToArr(dataStore?.gaHistory??{}))
const liveArr = computed(()=> objToArr(liveLog))
const gaCount = computed(()=>{
  let h = 0
  if (cacheDataOn.value) h += historyArr.value.length
  if (liveDataOn.value) h += liveArr.value.length
  return h
})
</script>

<template>
  <button title="giveAways: live & cached" class="flex flex-row items-center gap-1">
    <div class="text-xs leading-none">
      <label>
        <CodeJson /><Clams :clams="historyArr?.length" />
      </label>
      <label>
        <Twitch /><Clams :clams="liveArr?.length" />
      </label>
    </div>
    <label class="text-xl">
      <GiftOutline /><Clams :clams="gaCount" />
    </label>
  </button>
</template>

<style scoped>
section { @apply p-1 flex flex-row gap-0 rounded-xl px-3 }
label { @apply min-w-max flex flex-row-reverse items-center gap-0.5 px-1 }

</style>