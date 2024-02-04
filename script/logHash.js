const { readFileSync, writeFileSync, readdirSync } = require('fs')
const jsonPath = './public/json'

const goTime = async () =>{
  const files = await readdirSync(jsonPath)
  const theD = {}
  for await (const f of files){
    const k = f.split('-')[0] // find dataType
    const w = f.match(/-(\d+)\./)?.[1] // find week
    if(w && !theD?.[w]) theD[w] = {} // init week if needed
    if(w){ 
      const tw = theD[w]
      const d = JSON.parse(readFileSync(`${jsonPath}/${f}`,'utf-8')) // loadData
      if (k=='redeems'){ // merge per type
        tw.redeemsCount = d.length
        tw.redeemsPeople = Array.from(new Set(d.map(dd=>dd.user))).length
        tw.redeemsGames = Array.from(new Set(d.map(dd=>dd.game))).length
      } if(k=='gaHistory') { 
        tw.giveawaysPeople = Object.keys(d).length
        tw.giveawaysCount = Object.values(d)
          .map(dd=>Object.values(dd).length).flat()
          .reduce((a,c)=>a+=c,0)
        tw.giveawaysClams = Object.values(d)
          .map(dd=>Object.values(dd)).flat()
          .reduce((a,c)=>a+=c,0)
      } if(k=='gaEntries') {
        tw.entriesPeople = Object.keys(d).length
        tw.entriesCount = Object.values(d)
          .map(dd=>dd.length).flat()
          .reduce((a,c)=>a+=c,0)
      }    
    }
  }
  const theFile = `${jsonPath}/hashMap.json`
  const theJson = JSON.stringify(theD, null, 2)
  writeFileSync( theFile, theJson )
  // console.table(theD)
}

goTime()