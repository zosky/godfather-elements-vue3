<script>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
export default { 
  name: 'MyTour',
  data () {
    const router = useRouter()
    const dataStore = inject('$dataStore')
    const noScroll = { params: {enableScrolling: false, highlight: true }}
    const tourDone = ()=>{ 
      localStorage.setItem('tourDone',true) 
      if(dataStore?.user?.username=='zoskyb') delete dataStore.user      
    }
    return {
      myCallbacks: { onStop: tourDone, onSkip: tourDone, onFinish: tourDone },
      steps: [
        // intro
        { target: 'header', header: { title: 'the TGF stats no1 asked for' }, content: 'a leaderBoard for giveAway winners<br><small><br><em>[esc]</em> to close the tour<br><em>[left/right]</em> = prev/next<br>open again f/ the top corner', 
          before: () => { router.push('/giveaways') }
        },
        { target: '#logo', header: { title: 'color changing logo' }, content: 
          '<small>...b/c CSS is cool</small><br>smash to open TGFs steam on twitch' },
        { ...noScroll, target: '#elementsLink', header: { title: 'store <em>"proper"</em>' }, content: 'open the streamElements store' },
        { ...noScroll, target: '#gameList', header: { title: 'integrated list'}, content: 'TGFs elements store<br>here, w/style :P<br><small>(more on this after a few steps)</small>' },
        { ...noScroll, target: '#user', header: { title: '<b>NOT a login</b>' }, 
          content: `put you or any1 here<br><b>you can change it now:</b>
          <br><small>smash <b>[middleMouse]</b> <u>on the name</u> and type away.
          <br>if that user is on the leaderBoard, it will be remembered for next time
          <br>if not found, it will be cleared... try again.
          <br><em>(warning: leaving it blank will bork the rest of the tour</em></small>`,
          before: () => { if (!dataStore?.user?.username) dataStore.user = { username: 'zoskyb', points: 1337, rank: 1337, watchtime: 4524568 }}
        },
        { ...noScroll, target: '#points', header: { title: '🐚s collected' }, content: 'my clam count' },
        { ...noScroll, target: '#rank', header: { title: 'leaderBoard position' }, content: 'my current position' },
        { ...noScroll, target: '#youAreHere', header: { title: 'also, you are here' }, content: 'if the community was a barChart?' },
        { ...noScroll, target: '#watchtime', header: { title: '!watchtime' }, content: 'same as the command' },

        ////////////////////
        // { ...noScroll, target: '#gameList', header: { title: '... theres more folks'}, content: 'remember this thing ?<br> wanna continue ?' },

        ////////////
        // dashboard
        { ...noScroll, target: '#gaStats', header: { title: 'TGFs generously knows no bounds?'}, content: 'you get clams, and you get clams,<br>everybody gets some clams' },
        { ...noScroll, target: 'label#cacheData', header: { title: 'old/archived' }, content: 'this chunk is in the app<br>updated once daily' },
        { ...noScroll, target: 'label#liveData', header: { title: 'streamChat' }, content: 'this data is collected here & now.<br>by listening to streamChat.<br><b>this will reset on page reload</b><br>(and those wont be seen again<br>until added to the cache "tomorrow")' },
        { ...noScroll, target: '#latestWinners', params: { highlight: true, placement: 'left' }, header: { title: 'live "log"'}, content: 'b/c TGF said so in chat<br><small>change howMany @ the top</small>' },
        { ...noScroll, target: '#userHistory', params: { highlight: true, placement: 'top' }, header: { title: 'winning'}, content: 'here be all the data, for this user' },
        { ...noScroll, target: '#searchDataForUser', params: { highlight: true }, header: { title: 'search [from/to|who]'}, content: 'find that special some1 here,<br>peep on your neighbors & give a congrats :P' },
        ////////////
        // games
        { ...noScroll, target: '#gameList', header: { title: '... theres more folks'}, content: 'remember this thing ?<br> wanna continue ?' },
        { target: 'header', header: { title: 'games subNav' }, content: '1st, wait a beat for the gameView Nav',
          before: () => { router.push('/store') },},
        { ...noScroll, target: '#gamesOnCan', header: { title: 'rewards i have earned' }, content: 'smash to show/hide <br>stuff i have the 🐚 for' },
        { ...noScroll, target: '#gamesOn', header: { title: 'better stuff?' }, content: '...on/off<br><small>stuff i need more 🐚 for</small>', },
        { ...noScroll, target: '#gamesOff', header: { title: 'disabled stuff' }, content: 'stuff n/a ATM' },
        // { ...noScroll, target: 'article.can', header: { title: '🕹️ 🐚 ✔️' }, content: 'have enough 🐚 for this' },
        // { ...noScroll, target: 'article.cant', header: { title: '🕹️ 🐚 💸' }, content: 'need more 🐚 for this' },
        { ...noScroll, target: '.game:nth-child(2) #steamSearch', header: { title: 'find@steam' }, content: 'opens in a new' },
        { ...noScroll, target: '.game:nth-child(3) #quantity', header: { title: 'stock' }, content: 'how many godFather has' },
        { ...noScroll, target: '.game:nth-child(4) #cost', header: { title: '🐚 needed' }, content: '🐚 have no real world value<br><small>but you need this many for this one</small>' },
        { ...noScroll, target: '#have', header: { title: '🕹️ <b>i</b> have' }, 
          content: `
            click here to see <em>your<em> collection
            <br><small>+/- w/ the <b>heart</b> on each card</small>
            <br><small>(saved in your browser storage)</small>`, 
          before: () => { 
            if (!dataStore?.haveGames?.length) dataStore.haveGames = [1,2,3] 
            if (!dataStore?.ignoredGames?.length) dataStore.ignoredGames = [1,2,3,4,5,6,7,8] 
          },
        },
        { ...noScroll, target: '#ignore', header: { title: 'meh! <small>not for me.</small>' }, 
          content: `not every game is for every1.
            <br>here be the ones you don't want.
            <br><small>+/- w/ the <b>eye</b> on each card</small>
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
          <br><small>remember to say thanks to TGF for all the awesome stuff :)</small>
          <br><br><small>questions, comments or suggestions.<br>find <em>zosky</em> on TGFs discord
            <br><br>whatever you do
            <br><b>do not use the konami code!</b>`, 
        before: () => { 
          if(dataStore?.user?.username=='zoskyb') delete dataStore.user 
          router.push(`/giveaways${
            dataStore?.user?.username?'/'+dataStore?.user?.username:''
          }`)
        }
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