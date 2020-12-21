import { Dialog, Loading } from 'quasar'
// import uuid from 'uuid'
import Pica from 'pica'

export function showMessage (msgType, message) {
  Loading.hide()
  Dialog.create({
    title: msgType,
    message: message
  })
}

export function myDateToTimeStamp (date) {
  const parts = date.split('/')
  // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  // January - 0, February - 1, etc.
  const mydate = new Date(parts[2], parts[0] - 1, parts[1], 13, 0)
  const newDate = new Date(mydate)
  const timeMil = Math.floor(newDate.getTime() / 1000)
  const timeStamp = {
    seconds: timeMil,
    nanoseconds: 0
  }
  return timeStamp
}

export function toTitleCase (str) {
  if (str) {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  } else {
    return str
  }
}

export function uploadFile (elementID) {
  const files = document.getElementById(elementID).files
  if (files.length <= 0) {
    return false
  }

  const reader = new FileReader()

  reader.onload = e => {
    const result = JSON.parse(e.target.result)
    return result
  }
  reader.readAsText(files.item(0))
}

export function unpackSearch () {
  // Unpack url to get scorecard to retrieve
  let query = window.location.search
  // Skip the leading ?, which should always be there,
  // but be careful anyway
  if (query.substring(0, 1) === '?') {
    query = query.substring(1)
  }
  const params = query.split(',')
  for (let i = 0; i < params.length; i++) {
    params[i] = unescape(params[i])
  }
  return params
}

export function getByValue (map, searchValue) {
  for (const [key, value] of map.entries()) {
    if (value === searchValue) { return key }
  }
}

export function compareValues (key, order = 'asc') {
  return function innerSort (a, b) {
    if (!a(key) || !b(key)) {
      // property doesn't exist on either object
      return 0
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key]
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    )
  }
}

export const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  currency: 'USD'
})

export function stripHTML (str) {
  if (str) {
    return str.replace(/(<([^>]+)>)/gi, '')
  } else {
    return str
  }
}

export async function compressImage (imageCanvas) {
  // Image loaded, let's optimize using pica now
  const pica = Pica()

  const MAX_WIDTH = 680,
    offScreenCanvas = document.createElement('canvas'), // setup a blank, hidden canvas for pica output
    filetype = 'image/png' // set max image width of 680px, change this if you want, set all output image to jpeg since its the smallest
  if (imageCanvas.width > MAX_WIDTH) {
    // if original image too big, resize to MAX_WIDTH
    offScreenCanvas.width = MAX_WIDTH
    offScreenCanvas.height = imageCanvas.height * (MAX_WIDTH / imageCanvas.width)
  } else {
    offScreenCanvas.width = imageCanvas.width
    offScreenCanvas.height = imageCanvas.height
  }
  const resized = await pica.resize(imageCanvas, offScreenCanvas, {
    unsharpAmount: 80, // default, change ifz you want
    unsharpRadius: 0.6, // default, change if you want
    unsharpThreshold: 2 // default, change if you want
  })

  return await pica.toBlob(resized, filetype, 0.9)
    .then(blob => {
      const imageFile = blob // Assign optimized blob to imageFile for Firebase Storage
      return imageFile
    })
}
