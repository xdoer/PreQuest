import { PreQuest, PreQuestFn } from '@prequest/core'
import {
  RequestCore,
  UploadRequest,
  UploadResponse,
  DownLoadRequest,
  DownLoadResponse,
} from './types'
import { adapter } from './adapter'

type PreQuestInstance<T, N> = PreQuest<T, N> & PreQuestFn<T, N>

export function createUpload<T, N>(request: RequestCore, instanceOpt?: UploadRequest & Partial<T>) {
  return <PreQuestInstance<UploadRequest & Partial<T>, UploadResponse & N>>(
    (PreQuest.create<UploadRequest & Partial<T>, UploadResponse & N>(
      adapter<UploadRequest & Partial<T>, N>(request),
      instanceOpt
    ) as unknown)
  )
}

export function createDownload<T, N>(
  request: RequestCore,
  instanceOpt?: DownLoadRequest & Partial<T>
) {
  return <PreQuestInstance<DownLoadRequest & Partial<T>, UploadResponse & N>>(
    (PreQuest.create<DownLoadRequest & Partial<T>, DownLoadResponse & N>(
      adapter<DownLoadRequest & Partial<T>, N>(request),
      instanceOpt
    ) as unknown)
  )
}
