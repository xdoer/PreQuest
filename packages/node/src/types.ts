import https from 'https'

export interface Request extends https.RequestOptions {
}

export interface Response {
  data: any
  status: number
  statusText?: string
  headers: Record<string, any>
}
