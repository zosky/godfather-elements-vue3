const dayjs = require('dayjs')
const mysql = require('mysql2/promise')
const sqlConfig = require('./dbAuth')

const redeems = require('../public/redeems.json')
const clams = require('../public/gaHistory.json')
const entries = require('../public/gaEntries.json')
const data = { redeems, clams, entries }

const loopObj = async (connection, table) => {
  for await (const r of Object.entries(data[table]) ){
    const who = r[0]
    const arr = Object.entries(r[1])
    const q2 = []
    for await (const g of arr){
      const what = table=='clams' ? g[1] : `"${g[1]}"`
      const when = dayjs.unix(g[0]).format('YYYY-MM-DD HH:mm:ss')
      q2.push(`( "${who}", ${what}, "${when}" )`)
    }
    console.log(table, q2.length, who )
    const q1 = 'insert ignore into ' + table + '(`who`,`what`,`when`) values ' 
    await connection.query( q1 + q2.join(',') + ';' )
  }
}

const loopArr = async (connection, table) => {
  for await (const p of Object.entries(data[table])){
    const who = p[0]
    const q2 = []
    for await (const e of p[1]){
      const when = dayjs.unix(e).format('YYYY-MM-DD HH:mm:ss')
      q2.push(`( "${who}", "${when}" )`)
    }
    console.log(table, q2.length, who )
    const q1 = 'insert ignore into ' + table + '(`who`,`when`) values '
    await connection.query( q1 + q2.join(',') + ';' )    
  }
}

mysql.createConnection(sqlConfig)
  .then(async (conn)=> { 
    await loopObj(conn, 'redeems') 
    await loopObj(conn, 'clams')
    await loopArr(conn, 'entries')
    await conn.destroy()
  })

