<script setup>
import { GamepadCircleDown, Database, Twitch } from 'mdue'
const liveRedeem = inject('$liveRedeem')
const dataStore = inject('$dataStore')
const toolTip = computed(() => [
  `games redeemed = ${(dataStore?.redeems?.length??0)+liveRedeem.length}`, 
  `- ${dataStore?.redeems?.length??0} from the app's database, updated in realtime, fetched fresh each time you open the page.`,
  `- ${liveRedeem.length} from twitch chat, updated while this page is open.`,
].join('\n'))
</script>

<template>
  <button :title="toolTip">
    <GamepadCircleDown class="text-2xl" />
    <div class="text-lg pl-2">
      {{ (dataStore?.redeems?.length??0) + liveRedeem.length }}
    </div>
    <ul>
      <li>
        {{ dataStore?.redeems?.length??0 }}
        <Database />
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