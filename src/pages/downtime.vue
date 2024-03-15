<script setup>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(duration)
dayjs.extend(advancedFormat)

const dataStore = inject('$dataStore')
const gaEntries = computed(()=> dataStore?.gaEntries ?? {} )
const entriesByTime = computed(()=>
  Object.entries(gaEntries.value)
    ?.reduce((acc,cur)=>{
      for (const c of cur[1]) { 
        acc.push({time:c,user:cur[0]})
      }
      return acc
    },[])
)
const entriesDurringBlackOut = computed(()=>{
  const e = entriesByTime.value
  const b = clamBlackouts.value
  const bData = b?.map( 
    blackout => e.filter(
      ee=>ee.time > blackout.start
        && ee.time < blackout.end
    ))
  const bStats = bData.map(b=>{
    const people = b.map(bb=>bb.user)
    const uniqPeople = Array.from(new Set(people))
    const peopleHits = uniqPeople?.map(p=>p={user:p,hits:b.filter(bb=>bb.user==p)})
    return peopleHits?.sort((a,b)=>a.hits.length>b.hits.length?-1:1)
      ?.filter(p=>p.user!='alfims') // respect
  })
  return { bData, bStats }
})
const gaHistory = computed(()=> dataStore?.gaHistory ?? {} )
const clamBlackouts = computed(()=> 
  Object.values(gaHistory.value)
    ?.map(c=>Object.keys(c))
    ?.flat()
    ?.sort((a,b)=>a<b?-1:1)
    ?.map((cur,cx,arr)=> cur={
      start:cx?arr[cx-1]:0, 
      end:cur, 
      diff:cx?cur-arr[cx-1]:0
    })
    ?.filter(c=>c?.diff>3600)
)

</script>

<template>
  <div id="outage">
    <section v-for="(blackout, bx) of clamBlackouts" :key="blackout.start">
      <label class="timeline">
        <div class="start" v-text="dayjs.unix(blackout.start).format('MMM Do HH:mm')" />
        <div class="end" v-text="dayjs.unix(blackout.end).format('HH:mm')" />
        <div
          class="duration" v-text="`${
            dayjs.duration(blackout.diff,'seconds').hours() 
          }:${
            dayjs.duration(blackout.diff,'seconds').minutes() 
          }`" />
        <div v-if="entriesDurringBlackOut?.bData?.[bx]?.length" class="entries" v-text="entriesDurringBlackOut?.bData?.[bx]?.length" />
        <div v-if="entriesDurringBlackOut?.bData?.[bx]?.length" class="people" v-text="Object.keys(entriesDurringBlackOut?.bStats?.[bx])?.length" />
        <div v-else class="opacity-50"> empty gap</div>
      </label>
      <div v-if="entriesDurringBlackOut?.bData?.[bx]" class="entryMap">
        <details
          v-for="d of entriesDurringBlackOut?.bStats?.[bx]" :key="d.user"
          :class="d.hits.length>=20?'high':d.hits.length>=10?'sus':'hidden'">
          <summary role="button">
            <div class="l" v-text=" d.hits.length " />
            <div class="u" v-text=" d.user" />
          </summary>
          <div class="userTimeline">
            <div v-for="hit of d?.hits" :key="hit.time">
              {{ dayjs.unix(hit?.time).format('HH:mm') }}
            </div>
          </div>
        </details>
        <div
          v-if="entriesDurringBlackOut?.bStats?.[bx]?.length" 
          class="theOthers"> {{ entriesDurringBlackOut?.bStats?.[bx]?.filter(p=>p.hits.length<10).length }} with less than 10 </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
#outage { @apply flex flex-row gap-2 flex-wrap p-2 }
#outage > section { @apply border border-purple-900 rounded-xl }
.timeline { @apply flex flex-row gap-x-2 px-2 flex-wrap max-w-xs }
.timeline > div { @apply font-bold }
.timeline > div::before { @apply font-light }
.timeline > div::after { @apply font-light }
.start::before { content: 'from ' }
.duration::before { content: 'for ' }
.end::before { content: 'until ' }
.entries::before { content: 'smashed ' }
.people::before { content: 'by ' }
.people::after { content: ' ppl? ' }
.entryMap { @apply px-2 flex flex-col flex-wrap gap-x-2 gap-y-1 }
.entryMap details { @apply p-0 rounded-md }
.entryMap summary { @apply flex flex-row gap-x-2 p-2 bg-black bg-opacity-25 }
.entryMap details > div { @apply p-2 }
.entryMap .l { @apply font-mono scale-110 origin-top }
.entryMap .u { @apply font-bold }
.entryMap .high { @apply text-red-400 bg-red-950 }
.entryMap .sus { @apply text-yellow-400 bg-yellow-950 }
.entryMap .small { @apply text-xs }
.theOthers { @apply font-light }
.userTimeline { @apply grid grid-cols-6 text-xs gap-1 max-w-md }
.userTimeline > div::before { content: '🦾'}
</style>