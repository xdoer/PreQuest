import { PreQuest } from '@prequest/core'
import { RequestCore, UploadResponse, DownLoadResponse } from './types'
import { adapter } from './adapter'
import { Config } from '@prequest/types'

export function createUpload(request: RequestCore, options?: Config) {
  return PreQuest.create(adapter<Config, UploadResponse>(request), options)
}

export function createDownload(request: RequestCore, options?: Config) {
  return PreQuest.create(adapter<Config, DownLoadResponse>(request), options)
}
