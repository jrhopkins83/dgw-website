/* eslint-disable no-undef */
export default {
  logEvent (category, action, label, value, sessionId = null) {
    dataLayer.push({
      event: 'customEvent',
      category: category,
      action: action,
      label: label,
      cid: this.getCid(),
      value: value,
      sessionId: sessionId
    })
  },

  logPage (path, name, sessionId = null) {
    dataLayer.push({
      path: path,
      event: 'customPageView',
      screenName: name,
      cid: this.getCid(),
      sessionId: sessionId
    })
  },

  getCid () {
    if (!localStorage.cid) {
      localStorage.cid = uid()
    }
    return localStorage.cid
  }
}
