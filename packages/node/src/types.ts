import { BaseOption } from '@prequest/types'

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
  proxy?: Proxy
  httpAgent?: any
  httpsAgent?: any
  maxRedirects?: number
  maxBodyLength?: number
}

export interface Response {
  data: any
  status: number
  statusText?: string
  headers: Record<string, any>
}
