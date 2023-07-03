
const getters = { 
  getJSON: async (jsonFile:string) => 
    fetch(`/${jsonFile}.json`)
      .then(r=>r.json())
      .then(r=>{ 
        dataStorage[jsonFile] = r
        return r 
      }),
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataStorage: Record<string,any> = reactive({
  welcome: 'Ready to dive in?' // example
  /* getters will fill the rest in with stuff from APIs */
})

const methods = { 
  Cap1stLetter: (string:string) => string.charAt(0).toUpperCase() + string.slice(1), 
  // ^props https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
}

export { dataStorage, getters, methods }
