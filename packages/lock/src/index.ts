import { AsyncPromise } from '@xdoer/x'
import { Options } from './types'

export type LockOptions = Options

export default class Lock {
  on = false

  constructor(private opt: Options) {
    const { promise, resolve } = new AsyncPromise()
    this.promise = promise
    this.resolvePromise = resolve
  }

  async getValue() {
    return this.opt.getValue()
  }

  async setValue(value: any) {
    return this.opt.setValue(value)
  }

  async clear() {
    if (this.on) return
    const { promise, resolve } = new AsyncPromise()
    this.promise = promise
    this.resolvePromise = resolve
    return this.opt.clearValue()
  }

  resolvePromise: any
  promise: Promise<any>

  static createLockWrapper(lock: Lock) {
    return async function(fn: () => Promise<any>) {
      if (lock.on) return lock.promise

      lock.on = true

      let value = await lock.getValue()
      if (value === undefined) {
        value = await fn()
      }

      await lock.setValue(value)

      lock.on = false

      lock.resolvePromise(value)

      return value
    }
  }
}
