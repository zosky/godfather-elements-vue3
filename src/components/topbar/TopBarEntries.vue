<script setup>
import { Ticket, Twitch, CodeJson } from 'mdue'
const dataStore = inject('$dataStore')
const liveEntries = inject('$liveEntries')
const cacheDataOn = ref(true)
const liveDataOn = ref(true)
const objToArr = arr => Object.values(arr).flat()
const historyArr = computed(()=> objToArr(dataStore?.gaEntries??{}))
const liveArr = computed(()=> objToArr(liveEntries))
const gaCount = computed(()=>{
  let h = 0
  if (cacheDataOn.value) h += historyArr.value.length
  if (liveDataOn.value) h += liveArr.value.length
  return h
})
const toolTip = computed(()=>[
  'player engagement page: shows who is !hitquad\'n how often',
  ` - ${historyArr.value.length} from app history, updated hourly`,
  ` - ${liveArr.value.length} collected live from stream chat, while this page has been open`
].join('\n'))
</script>

<template>
  <button :title="toolTip" @click="$router.push('/engagment')">
    <div class="text-xs leading-none">
      <label>
        <CodeJson /><Clams :clams="historyArr?.length" />
      </label>
      <label>
        <Twitch /><Clams :clams="liveArr?.length" />
      </label>
    </div>
    <label class="text-xl">
      <Ticket /><Clams :clams="gaCount" />
    </label>
  </button>
</template>

<style scoped>
button { @apply p-1 flex flex-row gap-0 rounded-xl px-3 }
label { @apply min-w-max flex flex-row-reverse items-center gap-0.5 px-1 }
</style>