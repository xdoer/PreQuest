import { Lock } from './Lock'

export { Lock } from './Lock'

export function createLockWrapper(lock = new Lock()) {
  return async function(fn: () => Promise<any>) {
    if (lock.on) return lock.promise

    const cacheValue = await lock.getValue()
    if (cacheValue) return cacheValue

    lock.on = true

    const value = await fn()
    await lock.setValue(value)

    lock.resolvePromise(lock.value)

    lock.on = false

    return lock.value
  }
}
