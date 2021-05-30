import { Lock } from './Lock'

export { Lock } from './Lock'

export function createLockWrapper(lock = new Lock()) {
  return async function(fn: () => Promise<any>) {
    if (lock.on) return lock.promise

    if (lock.value) return lock.value

    lock.on = true

    lock.value = await fn()

    lock.resolvePromise(lock.value)

    lock.on = false

    return lock.value
  }
}
