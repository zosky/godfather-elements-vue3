<script setup>
const route = useRoute()
const dataStore = inject('$dataStore')
const user = ref(route?.params?.user?.toLowerCase())
dataStore.mini = true
</script>
<template>
  <div>
    <UserEngagment :user="user" />
  </div>
</template>