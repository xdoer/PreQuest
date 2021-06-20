import { create, PreQuest } from '../lib/prequest/index.js'

PreQuest.defaults.baseURL = 'http://localhost:8080'

const prequest = create(wx.request)
const wxUpload = create(wx.uploadFile)
const wxDownload = create(wx.downloadFile)


prequest.use(async (ctx,next) => {
  console.log('查看请求参数', ctx.request)

  await next()

  console.log('查看响应数据', ctx.response)
})

export { prequest, wxUpload, wxDownload }
