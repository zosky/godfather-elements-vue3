const tmi = require('tmi.js')
const opts = { channels: [ '#hitsquadgodfather' ] }
const say = t => process.stdout.write(t)
const mysql = require('mysql2/promise')
const sqlConfig = require('./dbAuth')
const { showRedeemsOnCord } = require('./discordRedeemsAnanounce')
let sql = null // will hold connection for current run
let antiCheatTimers = {} // will hold timers for each user
const sqlInsert = async (table,values) => {
  const fields = { redeems: '(`who`,`what`)', clams: '(`who`,`what`)', entries: '(`who`)', anticheat: '(`who`,`pass`)' }
  await sql.query(`INSERT IGNORE INTO ${table} ${fields[table]} VALUES ${values};`)
  const icons = { 
    redeems: '🎮', 
    clams: '🐚', 
    entries: '🙋', 
    anticheat: values.includes(',2)') ? '🤖'  : values.includes(',1)') ? '✅' : '🛑' // Added shield emoji for other cases
  }
  say(`${icons[table]}`)
  // console.log( ` 💾 ${table} \t 🙋 ${values}`)
}

// Create a client with our options
const client = new tmi.client(opts)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.connect()

// Called every time the bot connects to Twitch chat
async function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
  sql = await mysql.createConnection(sqlConfig)
}

const anticheatFakeFinder = (user,cancel) => {
  if (cancel) { 
    clearTimeout(antiCheatTimers[user]) 
    antiCheatTimers[user] = null
  } else { 
    say('🛡️')
    antiCheatTimers[user] = setTimeout(() => { 
      sqlInsert('anticheat', `("${user}",2)`) 
    }, 3000)
  }
}

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  const isTGF = context.username == 'hitsquadgodfather'
  const isSE = context.username == 'streamelements'
  const clamsAwarded = isTGF ? msg.match(/(\w+) Has Been Sent (\d+) Clams/i) : []
  const anticheatCMD = msg.match(/^!anticheat/i)?.[0]
  const anticheat = isTGF ? msg.match(/(\w+) (passed|failed) their activity check/i) : []
  const winner = clamsAwarded?.[1]
  const amount = parseInt(clamsAwarded?.[2]??0,10)
  const isGAentry = !isTGF && msg.match(/^!hitsquad/i)?.[0] 
  const isRedeem = msg?.match(/(\w+) just redeemed (.*) PogChamp/)
  if(winner && amount && isTGF) { 
    sqlInsert('clams', `("${winner}", ${amount})`)
  } else if (isGAentry) {
    sqlInsert('entries', `("${context.username}")`)
  } else if (isRedeem?.[1] && isSE ) {
    sqlInsert('redeems', `("${isRedeem?.[1]}","${isRedeem?.[2]}")`)
    showRedeemsOnCord( isRedeem?.[1], isRedeem?.[2] )
  } else if (anticheatCMD) { 
    anticheatFakeFinder(context.username)
  } else if (anticheat?.[2]) {
    const user = anticheat?.[1]
    const result = anticheat?.[2] == 'passed' ? 1 : 0
    sqlInsert('anticheat', `("${user}",${result})`)
    anticheatFakeFinder(user,true)
  }
}
