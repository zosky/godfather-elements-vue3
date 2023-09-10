const moment = require('moment')
const { readFileSync } = require('fs')
const logFile = './public/gaHistory.json'
const bank = JSON.parse(readFileSync(logFile))

const allGAs = Object.values(bank).flat().map(g=> 
  Object.entries(g).map(gg=>{
    const day = moment(gg[0],'X').format('YYMMDD')
    return { x: gg[0], value: gg[1], day, ago: moment().diff(moment(gg[0],'X'),'hours') }
  })).flat()
  .sort((a,b)=>a.day>b.day?-1:1)

console.table(
  allGAs
    .filter(g=> g.ago < (24 * 3) )
    .reduce((a,c)=>{
      if(!a?.[c.day]) a[c.day]={}
      if(!a?.[c.day]?.[c.value]) a[c.day][c.value]=0
      a[c.day][c.value]++
      return a
    },{})
)
