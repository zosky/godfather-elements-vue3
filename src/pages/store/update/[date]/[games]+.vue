<script setup>
import { CalendarEdit, Calendar } from 'mdue'
const route = useRoute()
const router = useRouter()
const date = ref(route?.params?.date ?? '')
const dateEdit = ref(route?.params?.date?false:true)
watchEffect(()=>{
  const o = route?.params?.date
  const d = date?.value
  if (!d) dateEdit.value = true
  else if (o!=d) { 
    if (dateEdit.value) dateEdit.value=false // close editor on change
    router.push({
      name: route.name,
      params:{ date:d, games:route.params.games }
    })
  }
})
</script>

<template>
  <details :open="route?.params?.games?.length?true:false" class="flex flex-row gap-1 col-span-full" :class="{'text-yellow-300':dateEdit}">
    <summary>
      <label title="edit update name" role="button" class="flex flex-row items-center gap-1">
        <h3 :title="route?.params?.games?.length + ' games'" v-text="route?.params?.games?.length + '👾'" />
        <Calendar v-if="!dateEdit" />
        <CalendarEdit v-else />
        <input v-model="dateEdit" type="checkbox" class="hidden">
      </label>
      <h3 v-if="!dateEdit" :title="`edit update games`" role="button" v-text="`update:${date}`" />
      <input v-else v-model.lazy="date" placeholder="updateName" class="bg-transparent underline px-1" />
    </summary>
    <GameMultiSearch class="w-full" />
  </details>
</template>

<style scoped>
  details { @apply w-max }
  details[open] { @apply bg-purple-950 bg-opacity-50 p-2 shadow-lg shadow-purple-950 }
  summary { @apply flex flex-row gap-1 w-full flex flex-row }
</style>