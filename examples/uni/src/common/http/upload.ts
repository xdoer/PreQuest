import { createUpload } from '@prequest/miniprogram-addon'
import { uploadFile } from '@tarojs/taro'

interface WxUploadRequest {
  filePath: string
  name: string
}

export const wxUpload = createUpload<WxUploadRequest, any>(uploadFile)
