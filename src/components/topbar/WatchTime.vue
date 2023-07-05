<script setup>
const dataStore = inject('$dataStore')
const watchRel = computed(()=> { 
  const wm = dataStore?.user?.watchtime 
  const h = wm/60
  const d = h/24
  const m = Math.floor(d/30)
  const dr = Math.floor(d-(m*30))
  const hr = Math.floor(h-(m*30*24)-(dr*24) )
  const mr = Math.floor(wm-(m*30*24*60)-(dr*24*60)-(hr*60) )
  return {m,dr,hr, mr}
})

</script>
<template>
  <div class="flex flex-row gap-1">
    <div class="mo" v-text="watchRel?.m" />
    <div class="da" v-text="watchRel?.dr" />
    <div class="hr" v-text="watchRel?.hr" />
    <div class="mi" v-text="watchRel?.mr" />
    📺
  </div>
</template>

<style scoped>
.hr::after { content: 'hrs'; @apply opacity-50 }
.da::after { content: 'day'; @apply opacity-50 }
.mo::after { content: 'mon'; @apply opacity-50 }
.mi::after { content: 'min'; @apply opacity-50 }
</style>