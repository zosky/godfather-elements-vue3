import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyBPELvSHMIKSUpy2vQVfO5m9RZiUj53W50',
  authDomain: 'godfather-stats.firebaseapp.com',
  projectId: 'godfather-stats',
  storageBucket: 'godfather-stats.appspot.com',
  messagingSenderId: '723154743703',
  appId: '1:723154743703:web:aac47bbf60e951310e94d2',
  measurementId: 'G-K7VM516MX9'
}

// init:Firebase
const app = initializeApp(firebaseConfig)

export { app }