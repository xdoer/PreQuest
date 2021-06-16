import PreQuest, { PreQuestFn } from '@prequest/core'
import {
  RequestCore,
  UploadRequest,
  UploadResponse,
  DownLoadRequest,
  DownLoadResponse,
} from './types'
import { adapter } from './adapter'

type PreQuestInstance<T, N> = PreQuest<T, N> & PreQuestFn<T, N>

export function createUpload<T, N>(request: RequestCore, instanceOpt?: UploadRequest & T) {
  return <PreQuestInstance<UploadRequest & T, UploadResponse & N>>(
    (PreQuest.create<UploadRequest & T, UploadResponse & N>(
      adapter<T, N>(request),
      instanceOpt
    ) as unknown)
  )
}

export function createDownload<T, N>(request: RequestCore, instanceOpt?: DownLoadRequest & T) {
  return <PreQuestInstance<DownLoadRequest & T, UploadResponse & N>>(
    (PreQuest.create<DownLoadRequest & T, DownLoadResponse & N>(
      adapter<T, N>(request),
      instanceOpt
    ) as unknown)
  )
}
