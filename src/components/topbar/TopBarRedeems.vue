<script setup>
import { GamepadCircleDown, CodeJson, Twitch } from 'mdue'
const liveRedeem = inject('$liveRedeem')
const dataStore = inject('$dataStore')
const historyCount = computed(()=>Object.values(dataStore?.redeems??{})?.length)
const toolTip = computed(() => [
  `games redeemed = ${historyCount.value+liveRedeem.length}`, 
  `- ${historyCount.value} from the app's cache, updated hourly (loaded once when you open the page).`,
  `- ${liveRedeem.length} from twitch chat, updated while this page is open.`,
].join('\n'))
</script>

<template>
  <button :title="toolTip">
    <GamepadCircleDown class="text-2xl" />
    <div class="text-lg pl-2">
      {{ (historyCount) + liveRedeem.length }}
    </div>
    <ul>
      <li>
        {{ historyCount }}
        <CodeJson />
      </li>
      <li>
        {{ liveRedeem.length }}
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