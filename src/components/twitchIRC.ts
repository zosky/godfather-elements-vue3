import tmi from 'tmi.js'
import moment from 'moment'
import { getters } from './DataStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const liveLog: Record<string,any> = reactive({})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const liveEntries: Record<string,any> = reactive({})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const liveRedeem: Record<string,any> = reactive([])
const clientStatus = reactive({ connected:false })

// Register our connect handlers
function onConnectedHandler (addr='twitch', port=1337) {
  console.log(`* Connected to ${addr}:${port}`)
  clientStatus.connected = true
}
// Called every time a message comes in
// log if GA ended
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onMessageHandler (target:any, context:any, msg:string) {
  if (context.username == 'hitsquadgodfather') {
    const clamsAwarded = msg.match(/(\w+) Has Been Sent (\d+) Clams/i)
    const winner = clamsAwarded?.[1]
    const amount = parseInt(clamsAwarded?.[2]??'0',10)
    const winTime = moment().format('X')
    const isTrivia = msg.includes('Trivia ')
    if(winner && amount && !isTrivia) { 
      if (!liveLog?.[winner]) liveLog[winner] = {}
      liveLog[winner][winTime] = amount
    } else { 
      console.log(winTime, 'err', msg)
    }
  } else if (context.username == 'streamelements'){
    const isRedeem = msg?.match(/(\w+) just redeemed (.*) PogChamp/)
    const winner = isRedeem?.[1]
    const game = isRedeem?.[2]
    const time = moment().format('X')
    if(winner && game) { 
      liveRedeem.push({user:winner,game,time:parseInt(time,10)})
      getters.elements.ls()
    } else { 
      console.log(time, 'err?!', msg)
    }
  } else { 
    if (msg.match(/^(!hitsquad)/i)?.[1]) {
      const t = moment().format('X')
      const u = context.username
      if(!liveEntries?.[u]) liveEntries[u] = []
      liveEntries[u].push(t)
    }
  }
}

// connect
const client = new tmi.client({ channels: [ '#hitsquadgodfather' ] })
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.connect()

export { liveLog, liveEntries, liveRedeem }
