<script setup>
import moment from 'moment'
import { Eye } from 'mdue'
const liveRedeem = inject('$liveRedeem')
const dataStore = inject('$dataStore')
const me = computed(()=> dataStore?.user?.username )
const gameNameHashMap = computed(()=> dataStore?.gamesHashMap )
const perPerson = ref(false)
const viewSlicer = ref(56)
const allRedeems = computed(()=>[ 
  ...liveRedeem ?? [], 
  ...dataStore?.redeems ?? []
])
const redeems = computed(()=> {
  const reducedD = allRedeems.value?.reduce((a,c)=>{
    if (!a?.[c.game]) a[c.game] = {}
    a[c.game][c.time] = c.user
    return a
  },{})
  const finalD = Object.entries(reducedD).map((g)=>g={name:g[0],data:g[1], count: Object.keys(g[1]).length})
  return finalD.sort((a,b)=>a.count<b.count?1:-1)
})
const redeemsPerPerson = computed(()=>{
  const allD = allRedeems.value.reduce((a,c)=>{ 
    if ( c?.user ){
      if( !a?.[c?.user] ) a[c.user] = {}
      if( !a?.[c?.user]?.[c?.game] ) a[c.user][c.game] = []
      a[c.user][c.game].push(c.time)
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
</script>

<template>
  <section>
    <div class="col-span-full flex w-full justify-between pt-3 items-center">
      <div class="flex gap-1 items-center">
        <button
          class="px-2" :class="{'bg-purple-950':perPerson}"
          title='"pivot" redeems by person' @click="perPerson=true"
          v-text="'perPerson'" />
        <button
          class="px-2" :class="{'bg-purple-950':!perPerson}"
          title='"pivot" redeems by game' @click="perPerson=false"
          v-text="'perGame'"/>
        <label class="opacity-75 font-light" @click.prevent=""> click any {{ perPerson?'person':'game' }} to see {{  perPerson ?'their redeems':'who grabbed it' }}</label>
      </div>
      <div class="flex flex-row items-center gap-2" :title="`${redeems.length} people now have ${allRedeems?.length??0} games\nthanks to TGF`">
        <div>
          <b class="people" v-text="redeems.length??0" />
          <b class="games" v-text="allRedeems?.length??0" />
        </div>
        <label>
          <Eye class="-mr-6" />
          <input
            v-model="viewSlicer" type="number"
            :max="perPerson ? redeemsPerPerson.length : redeems.length" :min="32"
            :title="`show more or less\ncurrent max=${perPerson ? redeemsPerPerson.length : redeems.length} ${perPerson ? 'people' : 'games'}`" 
            class="w-20 bg-transparent border-purple-900 text-right rounded-xl h-8" />
        </label>
        <a
          class="border rounded-xl bg-purple-950 px-2 border-purple-800" href="https://streamelements.com/dashboard/account/redemptions"
          title="open the steamElements redeems page" target="steamElements"
          v-text="`my🔑s`"/>
      </div>
    </div>
    <template v-if="!perPerson">
      <details v-for="game of redeems.slice(0,viewSlicer)" :key="game?.name">
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
      <details
        v-for="person of redeemsPerPerson.slice(0,viewSlicer)" :key="person.user"
        :class="{'border border-purple-600 rounded-xl bg-purple-950 px-1':me == person.user}">
        <summary role="button" :title="`${person.user} has grabbed ${person.gameCount} game${person.gameCount-1?'s':''} & ${person.keyCount} key${person.keyCount-1?'s':0}`">
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
    <button 
      v-if="viewSlicer <= (perPerson?redeemsPerPerson.length:redeems.length)" class="bg-purple-950 text-2xl font-bold" 
      @click="viewSlicer += 32" 
      v-text="`+32 more [of ${perPerson?redeemsPerPerson.length - viewSlicer:redeems.length - viewSlicer}]`" />
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