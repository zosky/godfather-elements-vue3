const { writeFileSync, readFileSync } = require('fs')
const moment = require('moment')
const tmi = require('tmi.js')
const logFile = './public/gaHistory.json'
const bank = JSON.parse(readFileSync(logFile))

const opts = { channels: [ '#hitsquadgodfather' ] }

// Create a client with our options
const client = new tmi.client(opts)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.connect()

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
}

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  const isTGF = context.username == 'hitsquadgodfather'
  const clamsAwarded = isTGF ? msg.match(/(\w+) Has Been Sent (\d+) Clams/i) : []
  const winner = clamsAwarded?.[1]
  const amount = parseInt(clamsAwarded?.[2]??0,10)
  const winTime = moment().format('X')
  if(winner && amount) { 
    if (!bank?.[winner]) bank[winner] = {}
    bank[winner][winTime] = amount
  }
}

// save + consoleOUT each hour
setInterval( ()=>{
  writeFileSync(logFile, JSON.stringify(bank,null,2)) // save
  const bankUserCount = Object.keys(bank).length
  const bankTTL = Object.values(bank).map(u=>u=Object.values(u)).flat().reduce((a,c)=>a+=c,0)
  const bankGAcount = Object.values(bank).map(u=>u=Object.keys(u)).flat().length
  console.log( moment().format('hh:mm'), '🧑‍🤝‍🧑:', bankUserCount, '🐚:', bankTTL, '🎁:', bankGAcount )
}, /*per 1h*/ 60*60*1000 )