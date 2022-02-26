import { asyncPool, merge } from '@prequest/utils'
import { CallbackOption, Options, PreQuestRequest } from './types'

const DEFAULT_OPTIONS: Options = {
  chipSize: 10 * 1024 * 1024,
  poolLimit: 3,
  customFormData(formData, { chunk, file, idx }) {
    formData.append('name', file.name)
    formData.append('index', `${idx}`)
    formData.append('chunk', chunk)
    return formData
  },
}

export default class Uploader<N> {
  private options: PreQuestRequest<N> & Options

  constructor(opt?: Partial<Options & PreQuestRequest<N>>) {
    this.options = merge(DEFAULT_OPTIONS, opt)
  }

  getChipNum(file: File) {
    return Math.ceil(file.size / this.options.chipSize)
  }

  async upload(fileList: File[]) {
    const { chipSize, customFormData, request, poolLimit } = this.options

    return asyncPool(poolLimit, fileList, (file: File) => {
      // 计算切片数量
      const chipNum = this.getChipNum(file)

      // 切片列表
      const initList = new Array(chipNum).fill(0)
      const chipChunks = initList.map((_, idx) => file.slice(idx * chipSize, (idx + 1) * chipSize))

      // 创建任务列表
      const taskList = chipChunks.map((chunk, idx) => {
        const formData = customFormData(new FormData(), { chunk, file, idx })
        return { chunk, file, idx, formData }
      })

      // 批量上传
      return asyncPool(poolLimit, taskList, (task: CallbackOption & { formData: FormData }) => {
        const { formData, ...rest } = task
        return request(formData, rest)
      })
    })
  }
}
