import * as firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

// TEST FIREBASE CONFIG
var firebaseConfig = {
  apiKey: 'AIzaSyD6Uu3fQj7LcUCx9sXzsqLUKQoDmsocsW4',
  authDomain: 'donkeys-gone-wild.firebaseapp.com',
  databaseURL: 'https://donkeys-gone-wild.firebaseio.com',
  projectId: 'donkeys-gone-wild',
  storageBucket: 'donkeys-gone-wild.appspot.com',
  messagingSenderId: '633549083760',
  appId: '1:633549083760:web:5cebf6557c754f731bd0b5',
  measurementId: 'G-ZTHN3MFG0R'

}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebaseApp.auth()
const firebaseFunctions = firebaseApp.functions()
const firebaseStore = firebaseApp.firestore()
const Timestamp = firebase.firestore.Timestamp
const Fieldvalue = firebase.firestore.Fieldvalue

// *** Use emulators ***
if (window.location.hostname === 'localhost') {
  firebaseStore.settings({
    host: 'localhost:8080',
    ssl: false,
    ignoreUndefinedProperties: true
  })
  firebaseFunctions.useFunctionsEmulator('http://localhost:5001')
}

// *** Use firebase server ***
// firebase.firestore().enablePersistence()
//   .catch(function (err) {
//     if (err.code === 'failed-precondition') {
//       console.log('persistence failed-precondition')
//     } else if (err.code === 'unimplemented') {
//       console.log('persistence unimplemented')
//     }
//   })

// firebase.firestore().enablePersistence()
//   .catch(function (err) {
//     if (err.code === 'failed-precondition') {
//       console.log('persistence failed-precondition')
//     } else if (err.code === 'unimplemented') {
//       console.log('persistence unimplemented')
//     }
//   })

export {
  firebaseAuth,
  firebaseFunctions,
  firebaseStore,
  Timestamp,
  Fieldvalue
}
