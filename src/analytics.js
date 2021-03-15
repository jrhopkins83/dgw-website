import { uid } from 'quasar'

export default {
  logEvent (category, action, label, value) {
    window.window.dataLayer.push({
      event: 'customEvent',
      category: category,
      action: action,
      label: label,
      cid: this.getCid(),
      value: value
    })
  },

  logPage (path, name) {
    window.dataLayer.push({
      path: path,
      event: 'customPageView',
      screenName: name,
      cid: this.getCid()
    })
  },

  getCid () {
    if (!localStorage.cid) {
      localStorage.cid = uid()
    }
    return localStorage.cid
  }
}
