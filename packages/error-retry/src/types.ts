import { RequestOption } from '@prequest/types'

export type RetryControl<T> = (opt: RequestOption<T>, e?: Error) => boolean

export interface Options<T> {
  retryCount: number
  retryControl: RetryControl<T>
}
