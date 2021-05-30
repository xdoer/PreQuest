export class Lock {
  on = false

  value: any

  resolvePromise: any
  promise = new Promise(resolve => (this.resolvePromise = resolve))
}
