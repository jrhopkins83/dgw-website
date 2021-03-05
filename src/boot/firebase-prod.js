import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

// // PROD FIREBASE CONFIG
var firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: ''
}

// Initialize Firebase Performance Monitoring.
// firebase.performance()

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebaseApp.auth()
const firebaseFunctions = firebaseApp.functions()
const firebaseStore = firebaseApp.firestore()
const Timestamp = firebase.firestore.Timestamp
const Fieldvalue = firebase.firestore.Fieldvalue
const storage = firebase.storage()

firebaseStore.settings({
  // ssl: false,
  ignoreUndefinedProperties: true
})

// *** Uncomment for production
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
