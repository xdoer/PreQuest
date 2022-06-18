/// <reference types="@prequest/types" />
import CancelToken from '@prequest/cancel-token'

declare module '@prequest/types' {
  interface PQRequest extends PQ.PresetOption {
    cancelToken?: CancelToken
    onDownloadProgress?(e: { loaded: number; total: number }): void
    headers?: PQ.Common
    responseType?: 'json' | 'text' | 'arraybuffer' | 'blob' | ({} & string)
  }

  interface PQResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: PQ.Common
  }
}
