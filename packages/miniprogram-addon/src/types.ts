import { CommonObject, CancelToken } from '@prequest/types'

export type RequestCore = any

export interface CommonRequest {
  path?: string
  baseURL?: string
  url?: string
  header?: CommonObject
  getNativeRequestInstance?(value: Promise<RequestCore>): void
  cancelToken?: CancelToken
}

export interface DownLoadRequest extends CommonRequest {}

export interface DownLoadResponse {
  tempFilePath: string
}

export interface UploadRequest extends CommonRequest {}

export interface UploadResponse {
  data: string
  statusCode: number
}
