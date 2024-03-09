const tmi = require('tmi.js')
const opts = { channels: [ '#hitsquadgodfather' ] }
const say = t => process.stdout.write(t)
const mysql = require('mysql2/promise')
const sqlConfig = require('./dbAuth')
let sql = null // will hold connection for current run
const sqlInsert = async (table,values) => {
  const fields = { redeems: '(`who`,`what`)', clams: '(`who`,`what`)', entries: '(`who`)' }
  await sql.query(`INSERT IGNORE INTO ${table} ${fields[table]} VALUES ${values};`)
  const icons = { redeems:'🎮', clams: '🐚', entries: '🙋'}
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

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  const isTGF = context.username == 'hitsquadgodfather'
  const isSE = context.username == 'streamelements'
  const clamsAwarded = isTGF ? msg.match(/(\w+) Has Been Sent (\d+) Clams/i) : []
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
  }
}
