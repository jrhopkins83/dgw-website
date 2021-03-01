import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

// TEST FIREBASE CONFIG
var firebaseConfig = {
  apiKey: 'AIzaSyCCS8VSb-xeZl8dBwVxYooL3eghW6Xb9lw',
  authDomain: 'fir-authdemo-5cd82.firebaseapp.com',
  databaseURL: 'https://fir-authdemo-5cd82.firebaseio.com',
  projectId: 'fir-authdemo-5cd82',
  storageBucket: 'fir-authdemo-5cd82.appspot.com',
  messagingSenderId: '53210843527',
  appId: '1:53210843527:web:443fcc1f74d4c2d36e6b22'
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
