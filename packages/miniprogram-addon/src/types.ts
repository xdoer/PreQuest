import { CommonObject, CancelToken } from '@prequest/types'

export type RequestCore = any

declare module '@prequest/types' {
  interface PreQuestRequest {
    baseURL?: string
    header?: CommonObject
    params?: CommonObject
    getNativeRequestInstance?(value: Promise<RequestCore>): void
    cancelToken?: CancelToken
  }
}

export interface DownLoadResponse {
  tempFilePath: string
}

export interface UploadResponse {
  data: string
  statusCode: number
}
