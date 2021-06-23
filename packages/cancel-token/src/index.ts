type executorCallback = () => void

export default class CancelToken {
  private resolvePromise: any

  promise = new Promise(resolve => (this.resolvePromise = resolve))

  private __CANCEL__ = false

  get abortController() {
    try {
      return new AbortController()
    } catch (e) {
      return null
    }
  }

  constructor(private executor: (cb: executorCallback) => void) {
    this.executor(() => {
      if (this.__CANCEL__) return
      this.__CANCEL__ = true
      this.resolvePromise()
    })
  }

  static source() {
    let cancel: executorCallback
    const token = new CancelToken((c: executorCallback) => (cancel = c))
    return {
      token: token,
      cancel: cancel!,
    }
  }

  isCancel() {
    return this.__CANCEL__
  }
}
