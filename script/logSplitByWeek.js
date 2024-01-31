// a "oneTime use" script to split logFiles into monthly chunks

const moment = require('moment')
const { readFileSync, writeFileSync } = require('fs')
const logFileName = (t, d) => `./public/${d?'json/':''}${t=='h'?'gaHistory':t=='e'?'gaEntries':t=='r'?'redeems':''}${d?'-':''}${d?d:''}.json`
const history = JSON.parse(readFileSync(logFileName('h')))
const entry = JSON.parse(readFileSync(logFileName('e')))
const redeems = JSON.parse(readFileSync(logFileName('r')))

const logSplitWins = async () => {
  // groupBy WINS by month
  const newD = Object.entries(history).reduce((a,c)=>{
    for (const win of Object.entries(c[1])) {
      const date = moment(win[0],'X').format('YYYYww')
      if(!a?.[date]) a[date] = {}
      if(!a[date]?.[c[0]]) a[date][c[0]] = {}
      a[date][c[0]][win[0]] = win[1]
    }
    return a
  },{})
  return newD
}

const logSplitEntries = async () => {
  // groupBy entries by month
  const newD = Object.entries(entry).reduce((a,c)=>{
    for (const hit of c[1]) {
      const date = moment(hit,'X').format('YYYYww')
      if(!a?.[date]) a[date] = {}
      if(!a[date]?.[c[0]]) a[date][c[0]] = []
      a[date][c[0]].push(hit)
    }
    return a
  },{})
  return newD
}

const logSplitRedeems = async () => {
  // groupBy redeems by month
  const newD = Object.entries(redeems).reduce((a,c)=>{
    for (const r of Object.entries(c[1])) {
      const week = moment(r[0],'X').format('YYYYww')
      const user = c[0]
      const time = moment(r[0],'X').valueOf()
      const game = r[1]
      if (!a[week]) a[week] = []
      a[week].push({user,time,game})
    }
    return a
  },{})
  return newD
}

const fileOut = async (fType,newD) => {
  const thisWeek = moment().format('YYYYww')
  // for await (const thisWeek of Object.keys(newD)){
  const thisFile = logFileName(fType,thisWeek)
  const thisData = newD[thisWeek]
  writeFileSync(thisFile, JSON.stringify(thisData, null, 2))
  console.log(`${fType}>${thisWeek}`)
  // }
}

logSplitWins().then(d=> fileOut('h',d) )
logSplitEntries().then(d=> fileOut('e',d) )
logSplitRedeems().then(d=> fileOut('r',d) )