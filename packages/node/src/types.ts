import { BaseOption, CancelToken } from '@prequest/types'
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

export interface Request extends BaseOption {
  responseEncoding?: BufferEncoding
  socketPath?: string
  auth?: Auth
  proxy?: Proxy | false
  httpAgent?: http.Agent
  httpsAgent?: https.Agent
  maxRedirects?: number
  maxBodyLength?: number
  cancelToken?: CancelToken
}

export interface Response {
  data: any
  status: number
  statusText?: string
  headers: Record<string, any>
}
