import { BaseOption, CancelToken, RequestOption } from '@prequest/types'

export interface Request extends BaseOption {
  withCredentials?: boolean
  requestType?: 'json' | 'form' | ({} & string)
  responseType?: XMLHttpRequestResponseType
  getNativeRequestInstance?(promise: Promise<XMLHttpRequest>): void
  cancelToken?: CancelToken
  onDownloadProgress?(e: any): void
  onUploadProgress?(e: any): void
}

export interface Response<D = any> {
  data: D
  status: number
  statusText: string
  headers: Record<string, any>
}

export type Adapter<T, N> = (opt: RequestOption<T>) => Promise<N>
export type GetAdapter<T, N> = (adapter: Adapter<T, N>) => Adapter<T, N>
