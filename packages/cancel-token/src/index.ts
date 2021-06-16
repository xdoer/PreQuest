import { Cancel } from './Cancel'

export default class CancelToken {
  reason?: Cancel

  private resolvePromise: any

  promise = new Promise(resolve => (this.resolvePromise = resolve))

  constructor(private executor: (cb: (message?: string) => void) => void) {
    this.executor((message?: string) => {
      if (this.reason) return
      this.reason = new Cancel(message)
      this.resolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source() {
    let cancel
    const token = new CancelToken((c: any) => (cancel = c))
    return {
      token: token,
      cancel: cancel,
    }
  }

  static isCancel(value: Cancel) {
    return value.__CANCEL__
  }
}
