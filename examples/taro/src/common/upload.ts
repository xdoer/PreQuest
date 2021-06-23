import { createUpload } from '@prequest/miniprogram-addon'
import { parseResponse } from './mddleware'
import { uploadFile } from '@tarojs/taro'

interface WxUploadRequest {
  filePath: string
  name: string
}

export const wxUpload = createUpload<WxUploadRequest, any>(uploadFile)

wxUpload.use(parseResponse)
