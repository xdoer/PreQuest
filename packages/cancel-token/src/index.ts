import { Cancel } from './Cancel'

export * from './isCancel'

export class CancelToken {
  reason?: Cancel

  resolvePromise: any

  promise = new Promise(resolve => (this.resolvePromise = resolve))

  constructor(private executor: (cb: (v: string) => void) => void) {
    this.executor((message: string) => {
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
}
