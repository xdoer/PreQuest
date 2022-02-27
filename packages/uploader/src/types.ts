export interface CallbackOption {
  chunk: Blob
  file: File
  idx: number
}

export interface Options {
  chipSize: number // 要切片的大小
  poolLimit: number
  customFormData(formData: FormData, opt: CallbackOption): FormData
}

export interface PQRequest<N> {
  request: (formData: FormData, opt: CallbackOption) => Promise<N>
}
