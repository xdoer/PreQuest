export class CancelToken {
  promise: Promise<any>
  abortController: AbortController
  isCancel(): boolean
}
