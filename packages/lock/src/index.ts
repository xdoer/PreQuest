import { Lock } from './Lock'

export { Lock } from './Lock'

export function createLockWrapper(lock: Lock) {
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
