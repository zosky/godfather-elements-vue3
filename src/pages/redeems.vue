<script setup>
import moment from 'moment'
const liveRedeem = inject('$liveRedeem')
const dataStore = inject('$dataStore')
const me = computed(()=> dataStore?.user?.username )
const perPerson = ref(false)
const allRedeems = computed(()=>[ 
  ...Object.entries(liveRedeem??{}), 
  ...Object.entries(dataStore?.redeems??{})
])
const redeems = computed(()=> {
  const allD = allRedeems.value
  const reducedD = allD?.reduce((a,c)=>{
    for (const g of Object.entries(c[1])){
      if (!a?.[g[1]]) a[g[1]] = {}
      a[g[1]][g[0]] = c[0]
    }
    return a
  },{})
  const finalD = Object.entries(reducedD).map((g)=>g={name:g[0],data:g[1], count: Object.keys(g[1]).length})
  return finalD.sort((a,b)=>a.count<b.count?1:-1)
})
const redeemsPerPerson = computed(()=>{
  const allD = allRedeems.value.reduce((a,c)=>{ 
    a[c[0]] = {} 
    for (const g of Object.entries(c[1])){
      if (!a?.[c[0]]?.[g[1]] ) a[c[0]][g[1]] = []
      a?.[c[0]]?.[g[1]].push(g[0])
    } 
    return a
  },{})
  const allDarr = Object.entries(allD)
    .map(g=>g={ 
      user: g[0], 
      games: g[1], 
      gameCount: Object.keys(g[1]).length,
      keyCount: Object.values(g[1]).flat().length 
    })
    .sort((a,b)=> a.keyCount>b.keyCount?-1:1)
  return allDarr
})
const totalCount = computed(()=>redeems.value?.reduce((a,c)=>a+=c?.count??0,0))
const gameNameHashMap = computed(()=>
  dataStore?.games?.reduce((a,c)=>{
    a[c.name] = c
    return a
  },{})
)
</script>

<template>
  <section>
    <label class="col-span-full flex w-full justify-between pt-3">
      <div class="flex gap-1">
        <button class="px-2" :class="{'bg-purple-950':perPerson}" @click="perPerson=true" v-text="'perPerson'" />
        <button class="px-2" :class="{'bg-purple-950':!perPerson}" @click="perPerson=false" v-text="'perGame'"/>
        <label class="opacity-75 font-light" @click.prevent=""> click any {{ perPerson?'person':'game' }} to see all {{  perPerson ?'games':'people' }}</label>
      </div>
      <div :title="`${redeems.length} people now have ${totalCount} games\nthanks to TGF`">
        <b class="people" v-text="redeems.length" />
        <b class="games" v-text="totalCount" />
        <a
          class="border rounded-xl bg-purple-950 px-2 border-purple-800" href="https://streamelements.com/dashboard/account/redemptions"
          title="open the steamElements redeems page" target="steamElements"
          v-text="`my🔑s`"/>
      </div>
    </label>
    <template v-if="!perPerson">
      <details v-for="game of redeems" :key="game?.name">
        <summary>
          <GameCard v-if="gameNameHashMap?.[game?.name]" :game="gameNameHashMap?.[game?.name]" class="gameCard" :controls="false" />
          <div v-else>{{ game?.name }}</div>
          <div class="count" :class="{me:Object.values(game?.data??{})?.includes(me)}" v-text="game?.count" />
        </summary>
        <ul>
          <li v-for="(user, date) of game?.data" :key="date">
            <span class="font-light font-mono text-xs" v-text="moment(date,'X').format('MMM DD HH:mm')" />
            <b v-text="user" />
          </li>
        </ul>
      </details>
    </template>
    <template v-else>
      <!-- <pre>{{ redeemsPerPerson[0] }}</pre> -->
      <details
        v-for="person of redeemsPerPerson" :key="person.user"
        :class="{'border border-purple-600 rounded-xl bg-purple-950 px-1':me == person.user}">
        <summary>
          👾{{ person.gameCount }}
          <span v-if="person.gameCount != person.keyCount">🔑{{ person.keyCount }}</span>
          🙋{{ person.user}}
        </summary>
        <div class="grid grid-cols-3 gap-1 p-2">
          <template v-for="(dates, game) of person.games" :key="game">
            <GameCard v-if="gameNameHashMap?.[game]" :game="gameNameHashMap?.[game]" class="gameCard col-span-2" :controls="false" />
            <div v-else class="col-span-2">{{ game }}</div>
            <ul class="text-right">
              <li v-for="date of dates" :key="date" class="text-xs" v-text="moment(date,'X').format('MMM DD HH:mm')" />
            </ul>
          </template>
        </div>
      </details>
    </template>
  </section>
</template>

<style scoped>
  section { @apply grid grid-cols-5 gap-1 p-2 }
  summary { @apply relative list-none }
  summary .count { @apply absolute top-0 right-0 px-2 p-1 rounded-xl bg-opacity-75 bg-purple-900 text-yellow-300 font-bold }
  summary .count::before{ content: '#' ; @apply font-light }
  .count.me::after{ content: '🙋'}
  ul { @apply p-1 flex flex-col-reverse leading-none }
  b { @apply px-1 }
  .people::after{content:'🧑‍🤝‍🧑'}
  .games::after{content:'👾'}
  button { @apply rounded-xl }
</style>