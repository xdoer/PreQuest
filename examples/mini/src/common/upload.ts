import { createUpload } from '@prequest/miniprogram-addon'
import { parseResponse } from './mddleware'

interface WxUploadRequest {
  filePath: string
  name: string
}

export const wxUpload = createUpload<WxUploadRequest, any>(wx.uploadFile)

wxUpload.use(parseResponse)
