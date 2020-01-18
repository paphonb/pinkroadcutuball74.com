class Channel {

  constructor(name, listener) {
    this.name = `channel-${name}`
    this.eventListener = e => {
      if (e.key === this.name) {
        const { action, payload } = JSON.parse(e.newValue).data
        listener(action, payload)
      }
    }
    window.addEventListener('storage', this.eventListener)
  }

  close() {
    window.removeEventListener('storage', this.eventListener)
  }

  send(action, payload) {
    localStorage.setItem(this.name, JSON.stringify({
      current: Date.now(),
      data: { action, payload },
    }))
  }
}

export default Channel
