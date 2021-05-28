export class Lock {
  on = false

  private resolvePromise: any
  promise = new Promise(resolve => (this.resolvePromise = resolve))

  lock = () => {
    this.on = true
  }

  unLock = () => {
    this.on = false
    this.resolvePromise()
  }
}
