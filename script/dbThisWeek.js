const { writeFileSync } = require('fs')
const mysql = require('mysql2/promise')
const sqlConfig = require('./dbAuth')


const thisWeek = ' WHERE YEARWEEK(`when`) = YEARWEEK(CURRENT_DATE) ORDER BY time ASC ;'
const q = { 
  redeems: 'SELECT UNIX_TIMESTAMP(`when`)*1000 as time, who as user, what as game FROM redeems' + thisWeek,
  entries: 'SELECT UNIX_TIMESTAMP(`when`) time, who FROM entries ' + thisWeek,
  clams: '  SELECT YEARWEEK(DATE_ADD(`when`, INTERVAL 1 WEEK)) week, UNIX_TIMESTAMP(`when`) time, who, what FROM clams ' + thisWeek,
}

mysql.createConnection(sqlConfig)
  .then(async conn => { 
    const r = await conn.query(q.redeems) 
    const c = await conn.query(q.clams) 
    const e = await conn.query(q.entries) 
    const week = c[0][0].week
    const objects = {
      redeems: r[0],
      gaHistory: c[0].reduce((a,c)=>{
        if(!a?.[c.who]) a[c.who] = {}
        a[c.who][c.time] = c.what
        return a
      },{}),
      gaEntries: e[0].reduce((a,c)=>{
        if(!a?.[c.who]) a[c.who] = []
        a[c.who].push(c.time)
        return a
      },{})
    }   
    // "save-all"
    for (const d of Object.entries(objects)){
      const fileName = `public/json/${d[0]}-${week}.json`
      const fileData = JSON.stringify(d[1],null,2)
      writeFileSync(fileName, fileData)
    }
    conn.destroy()
  })
