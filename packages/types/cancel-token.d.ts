export class CancelToken {
  promise: Promise<any>
  reason: string
  abortController: AbortController
}
