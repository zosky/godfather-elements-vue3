import tmi from 'tmi.js'
import moment from 'moment'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const liveLog: Record<string,any> = reactive({})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const liveEntries: Record<string,any> = reactive({})
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
    if(winner && amount) { 
      if (!liveLog?.[winner]) liveLog[winner] = {}
      liveLog[winner][winTime] = amount
    } else { 
      console.log(winTime, 'err', msg)
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

export { liveLog, liveEntries }
