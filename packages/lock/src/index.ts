import { Options } from './types'

export type LockOptions = Options

export default class Lock {
  on = false

  constructor(private opt: Options) {}

  async getValue() {
    return this.opt.getValue()
  }

  async setValue(value: any) {
    return this.opt.setValue(value)
  }

  async clear() {
    if (this.on) return
    this.on = false
    this.promise = new Promise(resolve => (this.resolvePromise = resolve))
    return this.opt.clearValue()
  }

  resolvePromise: any
  promise = new Promise(resolve => (this.resolvePromise = resolve))

  static createLockWrapper(lock: Lock) {
    return async function(fn: () => Promise<any>) {
      if (lock.on) return lock.promise

      lock.on = true

      const value = (await lock.getValue()) || (await fn())
      await lock.setValue(value)

      lock.on = false

      lock.resolvePromise(value)

      return value
    }
  }
}
