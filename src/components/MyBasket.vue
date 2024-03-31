<script setup>
import { Cart,CartOutline, GamepadVariant } from 'mdue'
const hideBasket = ref( localStorage.getItem('hideBasket')??false)
const dataStore = inject('$dataStore')
const myGames = computed(()=>
  dataStore?.basketGames
    ?.map((g,gx)=>dataStore?.games?.find(gg=>gg.name==g && gg.enabled) ?? { name: g, _id: gx })
    ?.filter(g=>g?._id)
    ?.sort((a,b)=>a.cost>b.cost?1:-1)
)
const totalCost = computed(()=>myGames?.value?.reduce((a,c)=>a+=c?.cost??0,0))
const userClams = computed(()=>dataStore?.user?.points)
const canAfford = computed(()=>myGames?.value?.reduce((a,c)=>{
  a.total -= c?.cost
  if (a.total>0) a.data.push(c)
  return a
},{ data:[], total: userClams.value }))
const confirmBasket = ()=>{
  const sure = confirm('hide basket?\nwarning: this will set a broswer localStorage item hideBasket=true ... and im too lazy to unSet it via the UI right now so if you wan to get it back you need to remove it from your browser devTools>sessionStorage.\n\nTLDR: its not easy to get it back unless you know how to use your browser :P')
  if (sure) { 
    hideBasket.value = true
    dataStore.hideBasket = true
    localStorage.setItem('hideBasket',true)
  }
}
</script>
<template>

  <section>
    <div v-if="!hideBasket" class="p-3 rounded-xl shadow-md shadow-green-800 bg-green-950 text-green-600 m-2 ">
      <template v-if="!myGames?.length">
        <h3>noGames selected ... yet?</h3>
        <h4 class="text-xs">to smash <CartOutline />/<Cart /> (add/rm games) go to the <GamepadVariant /> upTop</h4>
        <button class="text-sm" @click="confirmBasket" v-text="'or smash here to hide/ignore the basket'" />
      </template>
      <details v-else>
        <summary class="flex flex-col items-start gap-1">
          <div class="flex flex-row gap-1 items-center">
            <div>{{ myGames.length }} in </div>
            <Cart /> 
            <div>need</div>
            <Clams :clams="totalCost" class="clams font-mono"/>
            <span class="text-xs flex flex-row gap-1">
              i have <Clams :clams="dataStore?.user?.points" />
              .: i could get {{ canAfford?.data?.length }} new ones now ?
              or any combination of 1 or more from the {{ myGames?.filter(g=>g?.cost<dataStore?.user?.points)?.length }} 
              i have enough clams for 
              <span>
                {{ myGames.length>9 
                  ? `(smash to see ${myGames?.length-9} more or edit)`
                  : '(smash to open/close)' }}
              </span>
              <em class="opacity-75">💡remember to say thanks</em>
            </span>
          </div>
          <div class="miniList">
            <GameCard v-for="g of myGames?.filter(g=>g?._id)?.slice(0,9)" :key="g._id" :game="g" :controls="false" />
          </div>
        </summary>
        <div class="grid grid-cols-5 gap-1">
          <div v-for="g of myGames" :key="g?._id" >
            <GameCard v-if="g?.enabled" :game="g" />
            <div v-else v-text="g?.name" />
          </div>
        </div>
      </details>
    </div>
  </section>
</template>

<style scoped>
details[open] .miniList { @apply hidden }
.miniList { @apply flex flex-row gap-1}
</style>