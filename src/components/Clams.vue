<script setup>
const props = defineProps({clams:{type:Number, default:0}})
const dataStore = inject('$dataStore')
const showAsMoney = computed(()=> dataStore?.konami)
const money = computed(()=> (props.clams/100) )
const vals = computed(()=>{
  const n = props.clams
  const v = n >= 1000 ? `${(n/1000).toFixed(1)}k` : n
  const m = (money.value/100).toFixed(money.value>=1000?0:2)
  const t = showAsMoney?.value ? m : v
  const d = '\n*but 🐚 have no real world value'
  const altTxt = showAsMoney?.value ? `${v}🐚 might be worth ~${m}$💸USD${d}` : `${props.clams}🐚`
  return { clams: v, money: m, this: t, altTxt }
})
</script>

<template>
  <h6 :title="vals?.altTxt" v-text="vals?.this" />
</template>