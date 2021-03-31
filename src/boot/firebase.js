import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: process.env.firebaseConfig.apiKey,
  authDomain: process.env.firebaseConfig.authDomain,
  databaseURL: process.env.firebaseConfig.databaseURL,
  projectId: process.env.firebaseConfig.projectId,
  storageBucket: process.env.firebaseConfig.storageBucket,
  messagingSenderId: process.env.firebaseConfig.messagingSenderId,
  appId: process.env.firebaseConfig.appId,
  measurementId: process.env.firebaseConfig.measurementId
}
// Initialize Firebase Performance Monitoring.
// firebase.performance() TO-DO: Figure out how to include performance monitoring

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebaseApp.auth()
const firebaseFunctions = firebaseApp.functions()
const firebaseStore = firebaseApp.firestore()
const Timestamp = firebase.firestore.Timestamp
const Fieldvalue = firebase.firestore.Fieldvalue
const storage = firebase.storage()

// Use emulators
// if (window.location.hostname === 'localhost') {
//   firebaseStore.settings({
//     host: 'localhost:8080',
//     ssl: false,
//     ignoreUndefinedProperties: true
//   })
//   firebaseFunctions.useFunctionsEmulator('http://localhost:5001')
//   firebaseAuth.useEmulator('http://localhost:9099')
// }

// *** Use Firebase server
firebaseStore.settings({
  // ssl: false,
  ignoreUndefinedProperties: true
})

firebase.firestore().enablePersistence()
  .catch(function (error) {
    if (error.code === 'failed-precondition') {
      console.log('persistence failed-precondition')
    } else if (error.code === 'unimplemented') {
      console.log('persistence unimplemented')
    }
  })

export {
  firebaseAuth,
  firebaseFunctions,
  firebaseStore,
  Timestamp,
  Fieldvalue,
  storage
}
