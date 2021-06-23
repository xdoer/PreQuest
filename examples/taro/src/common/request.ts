import { create } from '@prequest/miniprogram'
import { request } from '@tarojs/taro'

// 根据需要，自定义的参数
interface Request {
  skipTokenCheck?: boolean
}

interface Response { }

export const prequest = create<Request, Response>(request)

