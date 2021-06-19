import { asyncPool, merge } from '@prequest/utils'
import { CallbackOption, Options, RequestOption } from './types'

const DEFAULT_OPTIONS: Options = {
  chipSize: 10 * 1024 * 1024,
  poolLimit: 10,
  customFormData(formData, { chunk, file, idx }) {
    formData.append('name', file.name)
    formData.append('index', `${idx}`)
    formData.append('chunk', chunk)
    return formData
  },
}

export default class Uploader<N> {
  private options: RequestOption<N> & Options

  constructor(
    private opt?: Partial<
      Options & { request: (formData: FormData, opt: CallbackOption) => Promise<N> }
    >
  ) {
    this.options = merge(DEFAULT_OPTIONS, this.opt)
  }

  async upload(file: File) {
    // 计算切片数量
    const chipNum = Math.ceil(file.size / this.options.chipSize)

    // 切片列表
    const chipChunks = new Array(chipNum)
      .fill(0)
      .map((_, idx) => file.slice(idx * this.options.chipSize, (idx + 1) * this.options.chipSize))

    // 创建 formData 数据列表
    const taskList = chipChunks.map((chunk, idx) => {
      const formData = this.options.customFormData(new FormData(), { chunk, file, idx })
      return { chunk, file, idx, formData }
    })

    // 批量上传
    return asyncPool(this.options.poolLimit, taskList, task => {
      const { formData, ...rest } = task
      return this.options.request(formData, rest)
    })
  }
}
