<script setup>
import { Twitch } from 'mdue'
const { elements } = inject('$getters')
const dataStore = inject('$dataStore')
const eUser = computed(()=> dataStore?.user )
const user = ref(localStorage.getItem('user'))
watchEffect(()=>{
  const u = user.value
  if (u) { 
    localStorage.setItem('user', u)
    elements.user(u).then(u => { if(!u?.username) user.value = null })
  }
})
const logout = () => { 
  user.value = null
  delete dataStore.user
  localStorage.removeItem('user') 
}
</script>

<template>
  <div class="flex items-center ml-2 flex-row-reverse" >
    <Twitch />
    <input
      v-if="!user && !eUser?.username"
      v-model.lazy="user" placeholder="twitchUser"
      class="-mr-5 pr-6 bg-transparent text-right" />
    <div v-else-if="eUser?.username" class="flex flex-row-reverse justify-end gap-3 items-center ml-1">
      <label title="twitch user. MIDDLE click to change" @click.middle="logout()" v-text="eUser?.username" />
      <label id="points" title="clams" v-text="eUser?.points/1000 + 'k🐚'" />
      <label id="rank" title="leaderBoard rank" v-text="eUser?.rank + '📈'" />
      <WatchTime id="watchtime" title="watchTime"/>
    </div>
  </div>
</template>