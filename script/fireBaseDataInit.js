const admin = require('firebase-admin')
const serviceAccount = require('./fireBaseServiceKey.json')
admin.initializeApp({ credential: admin.credential.cert(serviceAccount)})
const firestore = admin.firestore()
const dataCache = { 
  redeems: require('../public/redeems.json'),
  clams: require('../public/gaHistory.json'),
  entries: require('../public/gaEntries.json')
}

const getLast = async (collection) => { 
  const q = await firestore
    .collection(collection)
    .orderBy('time','desc')
    .limit(1)
    .get()
  const d = q.docs[0].data()
  return d?.time ?? null
  // return q.docs.map(doc => doc.data()) //.forEach(doc => { doc.data() })
}

const addNewer = async (lastTime, collection) => {
  let newCount = 0
  for await (const c of Object.entries(dataCache[collection])){
    const user = c[0]
    for await (const i of Object.entries(c[1])){
      const name = i[0]
      const time = parseInt(i[0])
      const isNew = time > lastTime
      if (isNew) { 
        newCount += 1
        // add prop unique to collection
        const obj = {time,user}
        const k = collection=='redeems' ? 'game' 
          : collection=='clams' ? 'clams'
            : null
        if(k) obj[k] = i[1] 
        // sauce
        await firestore
          .collection(collection)
          .doc(name)
          .set(obj)
          .then( () => console.log( collection, '✅', time, user, obj?.[k] ?? '' ) )
          .catch( err => console.log( collection, '⛔', time, user, obj?.[k] ??'', err) )
      }
      // else console.log('☁️', time, user, name )
    }
  }
  console.log( collection, '🏁 added', newCount)
}

getLast('redeems').then( r=> addNewer( r, 'redeems' ) )
// addNewer(0,'clams')