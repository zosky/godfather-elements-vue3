<script setup>
const props = defineProps({user:{type:String,default:null}})
const { elements } = inject('$getters')
const dataStore = inject('$dataStore')
if (props.user) { elements.user(props.user) }
const thisUser = computed(()=>dataStore?.theOthers?.[props.user])
</script>

<template>
  <div class="flex flex-row justify-between w-full text-xs px-2">
    <label :title="`leaderBoard rank: ${thisUser?.rank}`" class="min-w-max" v-text="`🎗️ ${ thisUser?.rank }`" />
    <WatchTime
      id="watchtime" :title="`watchTime: ${thisUser?.watchtime} minutes`"
      :watchtime="thisUser?.watchtime" :mini="true"
      class="min-w-max"/>
    <Clams :clams="thisUser?.points" class="clams min-w-max"/>
  </div>
</template>