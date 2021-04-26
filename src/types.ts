export interface AdapterConfig {
  method?: string
  url?: string
  timeout?: number
  withCredentials?: boolean
  headers?: Record<string, string>
  responseType?: XMLHttpRequestResponseType
}
