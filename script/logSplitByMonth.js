// a "oneTime use" script to split logFiles into monthly chunks

const moment = require('moment')
const { readFileSync, writeFileSync } = require('fs')
const logFileName = (t, d) => `./public/ga${t=='h'?'History':t=='e'?'Entries':''}${d?'-':''}${d?d:''}.json`
const history = JSON.parse(readFileSync(logFileName('h')))
const entry = JSON.parse(readFileSync(logFileName('e')))

const logSplitWins = async () => {
  // groupBy WINS by month
  const newD = Object.entries(history).reduce((a,c)=>{
    for (const win of Object.entries(c[1])) {
      const date = moment(win[0],'X').format('YYYYMM')
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
      const date = moment(hit,'X').format('YYYYMM')
      if(!a?.[date]) a[date] = {}
      if(!a[date]?.[c[0]]) a[date][c[0]] = []
      a[date][c[0]].push(hit)
    }
    return a
  },{})
  return newD
}

const fileOut = async (fType,newD) => {
  for (const month of Object.entries(newD)){
    console.log(`${fType}>${month[0]}`)
    writeFileSync(logFileName(fType,month[0]), JSON.stringify(month[1]))
  }
}

logSplitWins().then(d=> fileOut('h',d) )
logSplitEntries().then(d=> fileOut('e',d) )