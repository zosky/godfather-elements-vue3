const elementsAPI = 'https://api.streamelements.com/kappa/v2/store/61e8d63d3d12f65a5584b351/items?source=website'
const elementsUser = (u:string) => `https://api.streamelements.com/kappa/v2/points/61e8d63d3d12f65a5584b351/${u}`
const JSONheader = { headers: { accept: 'application/json, text/plain, */*'}}
const prodShim = import.meta.env.PROD ? '/godfather-elements-vue3' : ''

const getters = { 
  savedData: (k:string) => { // init browserData
    try { 
      const t = localStorage.getItem(k)
      const j = t?.length ? JSON.parse(t) : []
      dataStorage[`${k}Games`] = j
      console.log('List loaded', k, j )
    } catch(e) {
      console.log('List INIT', k, e)
      dataStorage[`${k}Games`] = []
    }
  },
  elements: { 
    ls: () => fetch(elementsAPI, JSONheader)
      .then( r => r.json() )
      .then( games => { 
        dataStorage.games = games
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataStorage.gamesHashMap = games.reduce((a:object[],c:Record<string,any>)=>{a[c.name]=c;return a},{})
        return games 
      }),
    user: (u:string, me:boolean) => fetch( elementsUser(u), JSONheader)
      .then( r => r.json() )
      .then( d => { 
        if (me) dataStorage.user = d
        else dataStorage.theOthers[u] = d
        return d
      }),
    leaderboard: (p=0) => {
      const lAPI = `https://api.streamelements.com/kappa/v2/points/61e8d63d3d12f65a5584b351/top/25?offset=${p}`
      fetch( lAPI )
        .then( r => r.json() )
        .then( r => { dataStorage.leaderboard = r })
    }
  },
  cache: async (c:string) => {
    return dataStorage?.[c] ?? fetch(`${prodShim}/json/${c}.json?date=${Date.now()}`)
      .then(r=> r.json() )
      .then(r=> { dataStorage[c] = r ; return r })
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataStorage: Record<string,any> = reactive({
  theOthers: {} // used to hold info on other people
  /* getters will fill the rest in with stuff from APIs */
})

const methods = { 
  Cap1stLetter: (string:string) => string.charAt(0).toUpperCase() + string.slice(1), 
  // ^props https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
  KonamiCode: ()=>{ 
    dataStorage.konami = !dataStorage?.konami ?? true     
    if(dataStorage.konami) { 
      alert('"clams have no real world value"')
      localStorage.setItem('konami',dataStorage.konami) // "save"
    } else { 
      localStorage.removeItem('konami')
    }
  }
}

export { dataStorage, getters, methods }
