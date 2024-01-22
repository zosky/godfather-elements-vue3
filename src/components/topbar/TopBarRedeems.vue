<script setup>
import { GamepadCircleDown, CodeJson, Twitch } from 'mdue'
const liveRedeem = inject('$liveRedeem')
const dataStore = inject('$dataStore')
const countObj = o => Object.entries(o??{})?.reduce(((a,c)=>a+=Object.keys(c?.[1]??{}).length),0)
const liveCount = computed(()=> countObj(liveRedeem??{}) )
const historyCount = computed(()=> countObj(dataStore?.redeems??{}))
const toolTip = computed(() => [
  `games redeemed = ${historyCount.value+liveCount.value}`, 
  `- ${historyCount.value} from app history, updated hourly.`,
  `- ${liveCount.value} from twitch chat, updated while this page is open.`,
].join('\n'))
</script>

<template>
  <button :title="toolTip">
    <GamepadCircleDown class="text-2xl" />
    <div class="text-lg pl-2">
      {{ historyCount + liveCount }}
    </div>
    <ul>
      <li>
        {{ historyCount }}
        <CodeJson />
      </li>
      <li>
        {{ liveCount }}
        <Twitch />
      </li>
    </ul>
  </button>
</template>

<style scoped>
  button { @apply flex flex-row-reverse items-center px-2 }
  ul { @apply flex flex-col justify-end }
  li { @apply text-xs leading-none text-right }
</style>