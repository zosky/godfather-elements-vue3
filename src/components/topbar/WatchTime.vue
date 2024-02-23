<script setup>
import moment from 'moment'
const props = defineProps({
  watchtime: {type:Number,default:0},
  mini: {type:Boolean,default:false}
})
const watchRel = computed(()=> { 
  const d = moment.duration(props?.watchtime, 'minutes')
  return { 
    y: d.years(), 
    m: d.months(),
    dr: d.days(),
    hr: d.hours(),
    mr: d.minutes(),
  }
})

</script>
<template>
  <div class="flex flex-row gap-1">
    <template v-if="mini">
      <div v-if="watchRel?.y" :class="watchRel?.y>1?'yrs':'yr'" v-text="watchRel?.y" />
      <div v-else-if="watchRel?.m" class="mo" v-text="watchRel?.m" />
      <div v-else-if="watchRel?.dr" class="da" v-text="watchRel?.dr" />
      <div v-else-if="watchRel?.hr" class="hr" v-text="watchRel?.hr" />
      <div v-else-if="watchRel?.mr" class="mi" v-text="watchRel?.mr" />
    </template>
    <template v-else>
      <div v-if="watchRel?.y>0" :class="watchRel?.y>1?'yrs':'yr'" v-text="watchRel?.y" />
      <div v-if="watchRel?.m>0" class="mo" v-text="watchRel?.m" />
      <div v-if="watchRel?.dr>0" class="da" v-text="watchRel?.dr" />
      <div v-if="watchRel?.hr>0" class="hr" v-text="watchRel?.hr" />
      <div v-if="watchRel?.mr>0" class="mi" v-text="watchRel?.mr" />
    </template>
    📺
  </div>
</template>

<style scoped>
.yr::after { content: 'yr'; @apply opacity-50 }
.yrs::after { content: 'yrs'; @apply opacity-50 }
.hr::after { content: 'hrs'; @apply opacity-50 }
.da::after { content: 'day'; @apply opacity-50 }
.mo::after { content: 'mon'; @apply opacity-50 }
.mi::after { content: 'min'; @apply opacity-50 }
</style>