import { PreQuest } from '@prequest/core'
import { RequestCore, UploadResponse, DownLoadResponse } from './types'
import { adapter } from './adapter'
import { PreQuestRequest } from '@prequest/types'

export function createUpload(request: RequestCore, options?: PreQuestRequest) {
  return PreQuest.create(adapter<PreQuestRequest, UploadResponse>(request), options)
}

export function createDownload(request: RequestCore, options?: PreQuestRequest) {
  return PreQuest.create(adapter<PreQuestRequest, DownLoadResponse>(request), options)
}
