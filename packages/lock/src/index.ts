import { Lock } from './Lock'

export { Lock } from './Lock'

export function createLockWrapper(lock = new Lock()) {
  return async function(fn: () => Promise<any>) {
    if (lock.on) return lock.promise

    if (lock.value) return Promise.resolve(lock.value)

    lock.on = true

    lock.value = await fn()

    lock.on = false

    lock.resolvePromise(lock.value)

    return Promise.resolve(lock.value)
  }
}
