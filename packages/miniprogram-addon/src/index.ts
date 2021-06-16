import PreQuest from '@prequest/core'

type PreQuestInstance<T, N> = PreQuest<T, N>

export { PreQuest, PreQuestInstance }

export { UploadRequest, UploadResponse, DownLoadRequest, DownLoadResponse } from './types'

export { createUpload, createDownload } from './create'
