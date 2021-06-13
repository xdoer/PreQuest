import { create } from '@prequest/miniprogram'
import { parseResponse } from './mddleware'

// 根据需要，自定义的参数
interface Request {
  skipTokenCheck?: boolean
}

interface Response { }

export const prequest = create<Request, Response>(wx.request)

prequest.use(parseResponse)
