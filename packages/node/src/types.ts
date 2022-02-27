/// <reference types="@prequest/types" />
import CancelToken from '@prequest/cancel-token'
import http from 'http'
import https from 'https'

interface Auth {
  username: string
  password: string
}

export interface Proxy {
  protocol: string
  host: string
  port: string
  auth: Auth
}

declare module '@prequest/types' {
  interface PQRequest extends PQ.PresetOption {
    responseEncoding?: BufferEncoding
    socketPath?: string
    auth?: Auth
    proxy?: Proxy | false
    httpAgent?: http.Agent
    httpsAgent?: https.Agent
    maxRedirects?: number
    maxBodyLength?: number
    cancelToken?: CancelToken
    timeout?: number
    headers?: PQ.Common
    responseType?: 'json' | 'text' | 'arraybuffer' | 'blob' | ({} & string)
  }

  interface PQResponse<T = any> {
    data: T
    status: number
    statusText?: string
    headers: PQ.Common
  }
}
