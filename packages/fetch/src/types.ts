import { BaseOption, CancelToken, RequestOption } from '@prequest/types'

export interface Request extends BaseOption {
  requestType?: 'json' | 'form' | ({} & string)
  cancelToken?: CancelToken
  onDownloadProgress?(e: { loaded: number; total: number }): void
}

export interface Response {
  data: any
  status: number
  statusText: string
  headers: Record<string, any>
}

export type Adapter<T, N> = (opt: RequestOption<T>) => Promise<N>
export type GetAdapter<T, N> = (adapter: Adapter<T, N>) => Adapter<T, N>
