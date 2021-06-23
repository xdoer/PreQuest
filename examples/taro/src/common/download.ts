import { createDownload } from '@prequest/miniprogram-addon'
import { downloadFile } from '@tarojs/taro'

interface WxDownloadResponse {
  tempFilePath: string
}

interface WxDownloadRequest { }

export const wxDownload = createDownload<WxDownloadRequest, WxDownloadResponse>(downloadFile, { baseURL: 'http://localhost:8080' })

wxDownload.use(async (ctx, next) => {
  await next()
  const { data, statusCode, tempFilePath } = ctx.response
  if (statusCode !== 200) throw new Error(data as string || '响应数据有误')
  ctx.response = tempFilePath as any
})
