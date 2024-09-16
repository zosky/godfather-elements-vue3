const { writeFileSync } = require('fs')
const fetch = require('node-fetch')
const elementsLS = 'https://api.streamelements.com/kappa/v2/store/61e8d63d3d12f65a5584b351/items?source=website'
const mysql = require('mysql2/promise')
const sqlConfig = require('./dbAuth')

const goTime = async () => {
  const sql = await mysql.createConnection(sqlConfig)
  const latestList = await sql.query('SELECT * FROM inventory WHERE (what, `when`) IN (SELECT what, MAX(`when`) FROM inventory GROUP BY what )  ORDER BY `when` ASC, `what` ASC ')
  
  const allEnabledGames = await fetch(elementsLS)
    .then(r => r.json())
    .then(r => r.filter(rr=>rr.enabled))
  // find reStocks
  const updatedGames = allEnabledGames.filter(g=> 
    (latestList?.[0].find(gg=>gg.what == g.name)?.qty??0) < g?.quantity?.current
  )
  // do the dew
  if (updatedGames.length) { 
    console.log(`inv=${updatedGames?.length}updated`)
    const games = `(${updatedGames.map(g=>g=`"${g.name}",${g.quantity.current}`).join('),(')})`
    await sql.query(`INSERT IGNORE INTO inventory ('what','qty') VALUES ${games};`)
  } else { 
    console.log(`inv=sameOrLess`)
  }

  // update json cache f/ DB
  const newSnapshot = await sql.query('SELECT UNIX_TIMESTAMP(`when`) as time, what, qty FROM inventory WHERE (what, `when`) IN (SELECT what, MAX(`when`) FROM inventory GROUP BY what )  ORDER BY `when` ASC, `what` ASC;')
  const fileName = `public/json/inventorySnapshot.json`
  const fileData = JSON.stringify(newSnapshot[0],null,2)
  writeFileSync(fileName,fileData)

  // the end
  await sql.close()
}

goTime()