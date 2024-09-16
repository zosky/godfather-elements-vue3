<script setup>
import { CameraOutline, Api, Twitch, Calculator, CheckboxMarkedCircleOutline, Eye, EyeOffOutline } from 'mdue'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
const liveRedeem = inject('$liveRedeem')
const dataStore = inject('$dataStore')
const { cache } = inject('$getters')
const me = computed(()=> dataStore?.user?.username )
const findSomething = ref('')
const findUser = ref('')
const thisGame = ref(null)
const onlyEnabled = ref(true)
const onlyChanged = ref(false)
const mismatched = ref(false)
const empty = ref(false)
const gameNameHashMap = computed(()=> dataStore?.gamesHashMap )
const perPerson = ref(false)
cache('inventorySnapshot')
const allRedeems = computed(()=>{
  const d = []
  if (liveRedeem?.length) d.push(...liveRedeem)
  if (dataStore?.redeems) d.push(...Object.values(dataStore.redeems))
  return d
})
const snapshot = computed(()=>{ 
  const d = dataStore?.inventorySnapshot 
  const api = dataStore?.gamesHashMap
  const redeems = allRedeems?.value?.reduce((a,c)=>{if(!a?.[c.game])a[c.game]=[];a[c.game].push(c);return a},{})
  const newD = Object.keys(api).map(g=>{
    const game = d?.find(dd=>g == dd?.what )
    const gAPI = api?.[g]?.quantity?.current
    const gRed = redeems?.[g]?.filter(gg=>gg.time/1000>game?.time)
    const enabled = api?.[g]?.enabled
    const cost = api?.[g]?.cost
    return { ... game, what: game?.what ?? g, api: gAPI, redeems: gRed, enabled, cost }
  })
  return newD
    // ?.filter(g=>g?.enabled)
    ?.sort((a,b)=>a?.what>b?.what?1:-1)
  // return d?.map(dd=>dd={
  //   ...dd,
  //   api:api?.[dd.what]?.quantity?.current,
  //   redeems: redeems?.[dd.what]?.filter(g=>g.time/1000>dd.time)
  // })
})
const onlyChangedFilter = () => {
  if (!empty.value) { // will change soon
    mismatched.value = false 
    onlyChanged.value = false
  }
}
</script>

<template>
  <section>
    <article class="px-2 max-w-fit m-2 flex flex-row gap-2">
      <label role="button" :class="{on:onlyEnabled}" class="hover:bg-purple-950 rounded-xl p-2">
        {{ `${onlyEnabled ? 'enabled' : 'all'} ${snapshot.filter(g=>g?.enabled)?.length} (${snapshot.length}) 🎮` }}
        <input type="checkbox" v-model="onlyEnabled" class="hidden" />
      </label>
      <label role="button" :class="{on:onlyChanged}" class="hover:bg-purple-950 rounded-xl p-2">
        {{ (onlyChanged ? 'only ':'show ') + `${snapshot.filter(g=>g?.qty != g?.api)?.length} 🎮 w/ redeems` }}
        <input type="checkbox" v-model="onlyChanged" class="hidden" />
      </label>
      <label role="button" :class="{on:mismatched}" class="hover:bg-purple-950 rounded-xl p-2">
        {{ `${mismatched ? 'only' : 'show'} ${snapshot.filter(game=>(game?.enabled && (game?.qty - (game?.redeems?.length??0)) != game?.api))?.length} "misMatched" 🎮` }}
        <input type="checkbox" v-model="mismatched" class="hidden" />
      </label>
      <label role="button" :class="{on:empty}" class="hover:bg-purple-950 rounded-xl p-2" @click="onlyChangedFilter()">
        {{ snapshot?.filter(g=>!onlyEnabled?true:g?.enabled)?.filter(g=>!g?.api)?.length }} empty
        <input type="checkbox" v-model="empty" class="hidden" />
      </label>
      🖱️ for other stuff
    </article>
    <table>
      <tr>
        <th class="flex flex-row items-start px-1">
          <input type="search" v-model="findSomething" placeholder="🔎game" />
        </th>
        <th class="num" title="clams"><Eye/></th>
        <th class="num" title="clams">🐚</th>
        <th class="num" title="snapshot data"><CameraOutline /></th>
        <th class="num" title="redeems announced in chat"><Twitch /></th>
        <th class="num" title="SE API NOW"><Api /></th>
        <th class="num" title="smells right?"><Calculator /></th>
        <th>
          <input type="search" v-model="findUser" placeholder="🔎user" />
        </th>
      </tr>
      <tr v-for="game of snapshot?.filter(g=> 
        ( !findSomething ? true : g?.what?.toLowerCase()?.includes( findSomething?.toLowerCase() ) )
        && (!findUser ? true : g?.redeems?.find(r=>r?.user?.toLowerCase()?.includes( findUser?.toLowerCase() ))?.user )
        && (!onlyChanged ? true : g?.qty != g?.api) 
        && (!onlyEnabled ? true : g?.enabled ) 
        && (!empty ? true : !g?.api ) 
        && (!mismatched ? true : (g?.qty - (g?.redeems?.length??0)) != g?.api) )" :key="game?.what" >
        <!-- <td class="date" v-text="dayjs.unix(game.time).format('MMM Do')" /> -->
        <td class="name" v-text="game?.what" />
        <td class="num">
          <Eye v-if="game?.enabled" />
          <EyeOffOutline v-else />
        </td>
        <td class="num" v-text="game?.cost/1000 + 'k'" />
        <td class="num qty" v-text="game?.qty" :title="`${game?.qty} @ ${dayjs.unix(game?.time).format()}`" />
        <td class="num cache" v-text="game?.qty == game?.api ? '-' : game?.redeems?.length" :title="game?.redeems?.length + 'logged'" />
        <td class="num api" v-text="game?.qty == game?.api ? '-' : game?.api" :title="`current SE quantity` "/>
        <td class="num calc" :class="(game?.qty - (game?.redeems?.length??0)) == game?.api ? 'good':'else'">
          <CheckboxMarkedCircleOutline v-if="(game?.qty - (game?.redeems?.length??0)) == game?.api" />
          <span v-else-if="game?.enabled">{{  (game?.qty - game?.redeems?.length) - game?.api  }}?</span>
        </td>
        <td class=redeemRow>
          <details v-if="game?.redeems?.length" :open="mismatched || findUser?.length">
            <summary>{{  game?.redeems?.length }} redeems</summary>
            <ul class="redeem">
              <template v-for="(u,ux) of game?.redeems" :key="ux">
                <ul :class="{thisUser: findUser?.length && u?.user?.toLowerCase()?.includes( findUser?.toLocaleLowerCase() )}">
                  <li class="date font-mono" v-text="dayjs.unix(u.time/1000).format('MMM Do HH:mm')" />
                  <li class="font-bold" v-text="u.user" />
                </ul>
              </template>
            </ul>
          </details>
        </td>
      </tr>
    </table>
  </section>
</template>

<style scoped>
section { @apply w-full pb-10 }
article, table { @apply mx-auto py-2 }
article { @apply items-center }
td { @apply px-1 align-top }
tr { @apply even:bg-purple-950 even:text-purple-400 border-b border-purple-950 }
.num { @apply text-right font-mono w-12 }
.name { @apply font-bold }
.date { @apply text-sm font-light text-right }
.redeem { @apply flex flex-col }
.redeem ul { @apply flex flex-row gap-x-1 align-bottom }
.qty { @apply bg-black bg-opacity-25 }
.cache { @apply bg-black bg-opacity-40 }
.api { @apply bg-black bg-opacity-60 }
.calc { @apply bg-black bg-opacity-80 }
.good { @apply text-sky-500 }
tr:has(.else) { @apply text-red-500 }
.redeemRow { @apply text-sm }
input { @apply bg-transparent p-0 m-0 border-0 w-max }
label { @apply ring-1 }
label.on { @apply font-bold bg-purple-950 text-purple-200 }
.thisUser { @apply text-pink-400 }
</style>