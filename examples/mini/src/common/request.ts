import { create } from '@prequest/miniprogram'
import { parseResponse } from './mddleware'

export const prequest = create(wx.request)

prequest.use(parseResponse)
