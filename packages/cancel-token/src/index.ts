import { createAsyncPromise } from '@xdoer/x'

type executorCallback = () => void

export default class CancelToken {
  promise: Promise<string>

  private __CANCEL__ = false

  constructor(private executor: (cb: executorCallback) => void) {
    const { resolve, promise } = createAsyncPromise<string>()

    this.promise = promise

    this.executor(() => {
      if (this.__CANCEL__) return
      this.__CANCEL__ = true
      resolve('')
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
