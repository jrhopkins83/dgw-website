import { Dialog, Loading } from 'quasar'

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

export function calcCourseHcp (hcpParms) {
  let fullHandicap = hcpParms.fullHandicap
  const rating = hcpParms.rating
  const slope = hcpParms.slope
  const par = hcpParms.par
  let courseHandicap = 0
  if (!fullHandicap) {
    fullHandicap = 14.5
  }
  courseHandicap = parseFloat((fullHandicap * (slope / 113) + (rating - par)).toFixed(1))
  return courseHandicap
}

// Forces signing on a number, returned as a string
export function getNumber (theNumber) {
  if (theNumber > 0) {
    return '+' + theNumber
  } else if (theNumber === 0) {
    return 'E'
  } else {
    return theNumber.toString()
  }
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
  var query = window.location.search
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
