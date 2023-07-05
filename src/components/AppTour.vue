<script>
import { inject } from 'vue'
export default { 
  name: 'MyTour',
  data () {
    const dataStore = inject('$dataStore')
    const noScroll = { params: {enableScrolling: false, highlight: true }}
    const tourDone = ()=>{ localStorage.setItem('tourDone',true) }
    return {
      myCallbacks: { onStop: tourDone, onSkip: tourDone, onFinish: tourDone },
      steps: [
        { target: 'header', header: { title: 'godfather loyalty rewards' }, content: 'streamElements+vue3<br>a storeFront concept' },
        { target: '#logo', header: { title: 'color changing logo' }, content: 
          '<small>...b/c CSS is cool</small><br>click to open twitch' },
        { ...noScroll, target: '#elementsLink', header: { title: 'store <em>"proper"</em>' }, content: 'open the streamElements store' },
        { ...noScroll, target: '#user', header: { title: '<b>leaderBoard lookup</b> (not a login)' }, 
          content: `to change it <b>(now?)</b>
          <br><small>[middle] mouse <u>on the name</u> then enter a userID
          <br>or it will be unSet after the demo
          <br><em>(warning:if left empty, the rest of the tour will bork)</em></small>`,
          before: () => { if (!dataStore?.user?.username) dataStore.user = { username: 'tourUser', points: 1337, rank: 1337, watchtime: 4524568 }}
        },
        { ...noScroll, target: '#points', header: { title: '🐚s collected' }, content: 'my clam count' },
        { ...noScroll, target: '#rank', header: { title: 'leaderBoard position' }, content: 'my current position' },
        { ...noScroll, target: '#watchtime', header: { title: '!watchtime' }, content: 'same as the command' },
        { ...noScroll, target: '#gamesOnCan', header: { title: 'enabled rewards' }, content: 'turn on/off<br>stuff i have 🐚 for' },
        { ...noScroll, target: '#gamesOn', header: { title: 'expensive rewards' }, content: '...on/off<br>stuff i need more 🐚 for', },
        { ...noScroll, target: '#gamesOff', header: { title: 'disabled rewards' }, content: '...nuf said' },
        // { ...noScroll, target: 'article.can', header: { title: '🕹️ 🐚 ✔️' }, content: 'have enough 🐚 for this' },
        // { ...noScroll, target: 'article.cant', header: { title: '🕹️ 🐚 💸' }, content: 'need more 🐚 for this' },
        { ...noScroll, target: '.game:nth-child(2) #steamSearch', header: { title: 'find@steam' }, content: 'opens in a new' },
        { ...noScroll, target: '.game:nth-child(3) #quantity', header: { title: 'stock' }, content: 'how many godFather has' },
        { ...noScroll, target: '.game:nth-child(4) #cost', header: { title: '🐚 required' }, content: '🐚 have no real world value<br><small>but you need this many for this one</small>' },
        { ...noScroll, target: '#have', header: { title: '🕹️ <b>i</b> have' }, 
          content: `
            click here to see <em>your<em> collection
            <br><small>+/- with the <b>heart</b> on each card to +/-</small>
            <br><small>gameIDs are saved in your browser</small>`, 
          before: () => { 
            if (!dataStore?.haveGames?.length) dataStore.haveGames = [1,2,3] 
            if (!dataStore?.ignoredGames?.length) dataStore.ignoredGames = [1,2,3,4,5,6,7,8] 
          },
        },
        { ...noScroll, target: '#ignore', header: { title: 'meh! <small>not for me.</small>' }, 
          content: `click here to see <em>your</em> ignored list
            <br><small>add/rm using the <b>eye</b> on each card</small>
            ` },
        { ...noScroll, target: '#sort', header: { title: 'sort stuff' }, content: 'by price, name, lastUpdated',
          before: () => { 
            if (dataStore?.haveGames?.[0]==1) dataStore.haveGames = []
            if (dataStore?.ignoredGames?.[0]==1) dataStore.ignoredGames = []
          }
        },
        { ...noScroll, target: '#search', header: { title: 'search' }, content: 'open/close the search box' },
        { ...noScroll, target: '#help', header: { title: 'thats all folks' }, content: `
          reStart the tour anyTime from here
          <br><small>remember to say thanks for all the awesome stuff :)</small>
          <br><br><small>questions, comments or suggestions.<br>find <em>zosky</em> on discord`, 
        before: () => { if(dataStore?.user?.username=='tourUser') delete dataStore.user }
        },
      ]
    }}, 
  mounted: function () { 
    const t = localStorage.getItem('tourDone')
    if (!t) this.$tours['myTour'].start() 
  },
}
</script>

<template>
  <v-tour name="myTour" :steps="steps" :callbacks="myCallbacks" />
</template>