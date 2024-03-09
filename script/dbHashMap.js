const { writeFileSync } = require('fs')
const mysql = require('mysql2/promise')
const sqlConfig = require('./dbAuth')

const q = { 
  e: `select 
    YEARWEEK(DATE_ADD(e.when, INTERVAL 1 WEEK)) week
    , count(DISTINCT(e.who)) as entriesPeople
    , count(e.who) as entriesCount
  from entries e
  group by YEARWEEK(DATE_ADD(e.when, INTERVAL 1 WEEK)) ;`,
  c: `select
    YEARWEEK(DATE_ADD(c.when, INTERVAL 1 WEEK)) week
    , count(DISTINCT(c.who)) as giveawaysPeople
    , count(c.who) as giveawaysCount
    , sum(c.what) as giveawaysClams
  from clams c
  group by YEARWEEK(DATE_ADD(c.when, INTERVAL 1 WEEK)) ;`,
  r: `select
    YEARWEEK(DATE_ADD(r.when, INTERVAL 1 WEEK)) week
    , count(r.what) as redeemsCount
    , count(DISTINCT(r.who)) as redeemsPeople
    , count(DISTINCT(r.what)) as redeemsGames
  from redeems r
  group by YEARWEEK(DATE_ADD(r.when, INTERVAL 1 WEEK)) ;`
}

mysql.createConnection(sqlConfig)
  .then(async conn => { 
    const r = await conn.query(q.r) 
    const c = await conn.query(q.c) 
    const e = await conn.query(q.e) 

    const ksa = [ r[0].map(rr=>rr.week), c[0].map(rr=>rr.week), e[0].map(rr=>rr.week) ]
    const ksr = Array.from(new Set(ksa.flat()))
    const allD = ksr.reduce((acc,cur)=>{
      const ccc = c[0].find(cc=>cc.week==cur)
      const cce = e[0].find(cc=>cc.week==cur)
      const ccr = r[0].find(cc=>cc.week==cur)
      if (!acc?.[cur]) acc[cur] = {}
      if (cce?.week) acc[cur] = { ... acc[cur], ...cce }
      if (ccc?.week) acc[cur] = { ... acc[cur], ...ccc }
      if (ccr?.week) acc[cur] = { ... acc[cur], ...ccr }
      return acc
    }
    ,{})
    // console.table(allD)
    const theFile = './public/json/hashMap.json'
    const theJson = JSON.stringify(allD, null, 2)
    writeFileSync( theFile, theJson )  
    conn.destroy()
    return allD
  })
