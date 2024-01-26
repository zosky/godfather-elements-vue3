<script setup>
import moment from 'moment'
const dataStore = inject('$dataStore')
const today = moment().format('YYYY-MM-DD')
const thisDate = ref(today)
const gameUpdateMap = computed(()=>
  dataStore?.games
    ?.filter(g=> g.enabled)
    ?.sort((a,b)=>a.updatedAt>b.updatedAt?-1:1)
    ?.reduce((a,c)=>{
      const date = moment(c.updatedAt).format('YYYY-MM-DD')
      if (!a?.[date]) a[date] = []
      a[date].push(c)
      return a
    },{})
)
</script>

<template>
  <section>
    <label>store updates @ </label>
    <select v-model="thisDate">
      <option v-for="(games,date) of gameUpdateMap" :key="date" :value="date" v-text="date" />
    </select>
    <article>
      <label>
        {{ gameUpdateMap[thisDate].length }} 👾 @ 📅 {{moment(thisDate,'YYYY-MM-DD').format('YY MMM Do')}}
      </label>
      <article>
        <ul>
          <li v-for="game of gameUpdateMap[thisDate]?.sort((a,b)=>a.name>b.name?1:-1)" :key="game._id">
            <h6 :title="'current keys available'">{{ game.quantity.current }}</h6>
            <h5 :title="'current clams'">{{ game.cost/1000 }}k</h5>
            <h3 :title="'game'">{{ game.name }}</h3>
          </li>
        </ul>
      </article>
    </article>
  </section>
</template>

<style scoped>
  select { @apply bg-transparent border-none }
  section { @apply p-4 }
  article > label{ @apply bg-purple-950 bg-opacity-25 border-b border-purple-950 px-2 font-bold }
  li { @apply flex flex-row gap-2 items-center text-sm }
  h6 { @apply text-right w-10 font-light font-mono text-xs select-none }
  h5 { @apply text-right w-10 font-light font-mono text-xs select-none }
</style>