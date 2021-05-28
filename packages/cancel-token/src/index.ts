import { Cancel } from './Cancel'

export * from './isCancel'

export class CancelToken {
  private reason?: Cancel

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
}
