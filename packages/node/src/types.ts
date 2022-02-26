import { BaseOption, CancelToken, CommonObject } from '@prequest/types'
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
  interface PreQuestRequest extends BaseOption {
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
    headers?: CommonObject
    responseType?: 'json' | 'text' | 'arraybuffer' | 'blob' | ({} & string)
  }

  interface PreQuestResponse<T = any> {
    data: T
    status: number
    statusText?: string
    headers: CommonObject
  }
}
