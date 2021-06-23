import Lock from '@prequest/lock'

const { getStorageSync, removeStorageSync, setStorageSync } = uni

export const lock = new Lock({
  async getValue() {
    return getStorageSync('token')
  },
  async setValue(token) {
    setStorageSync('token', token)
  },
  async clearValue() {
    removeStorageSync('token')
  }
})

export const wrapper = Lock.createLockWrapper(lock)
