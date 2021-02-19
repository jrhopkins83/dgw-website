/* eslint-disable no-undef */
export default {
  logEvent (category, action, label, value) {
    dataLayer.push({
      event: 'customEvent',
      category: category,
      action: action,
      label: label,
      cid: this.getCid(),
      value: value
    })
  },

  logPage (path, name) {
    dataLayer.push({
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
