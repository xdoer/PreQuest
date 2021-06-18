# @prequest/miniprogram-addon

小程序附加包.提供了上传和下载文件的封装，可以与 `@prequest/miniprogram` 共享全局配置、全局中间件等功能。

## 安装

```bash
npm install @prequest/miniprogram-addon
```

## 原生请求

首先，看一下微信小程序原生请求的 demo

```ts
const requestInstance = wx.downloadFile({
  url: 'http://localhost:3000/audio/123', //仅为示例，并非真实的资源
  success(res) {
    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    if (res.statusCode === 200) {
      wx.playVoice({
        filePath: res.tempFilePath,
      })
    }
  },
})

requestInstance.abort()
```

## 基本使用

### 下载

```ts
import { createDownload } from '@prequest/miniprogram-addon'

// 传入原生方法。这样可以适配各个小程序平台
const prequest = createDownload(wx.downloadFile, { baseURL: 'http://localhost:3000' })

prequest('/audio/123', { headers: { token: '123' } }).then(res => {
  if (res.statusCode === 200) {
    console.log('下载成功')
  }
})

// 或者使用时指定URL
prequest('http://localhost:3000/audio/123').then(res => {
  if (res.statusCode === 200) {
    console.log('下载成功')
  }
})
```

### 上传

```ts
import { createUpload } from '@prequest/miniprogram-addon'

// 传入原生方法。这样可以适配各个小程序平台
const prequest = createUpload(wx.uploadFile, { baseURL: 'http://localhost:3000' })

prequest('/audio/123', { headers: { token: '123' } }).then(res => {
  if (res.statusCode === 200) {
    console.log('上传成功')
  }
})

// 或者使用时指定URL
prequest('http://localhost:3000/audio/123').then(res => {
  if (res.statusCode === 200) {
    console.log('上传成功')
  }
})
```

### 配置

`miniprogram` 与 `miniprogram-addon` 共用一份全局配置，这意味着你配置到 `PreQuest` 的全局配置和全局中间件都是共用的。

```ts
import { PreQuest, create } from '@prequest/miniprogram'
import { createUpload } from '@prequest/miniprogram-addon'

PreQuest.defaults.baseURL = 'http://localhost:3000'

PreQuest.use(async (ctx, next) => {
  console.log(ctx.request)

  await next()

  console.log(ctx.response)
})

const prequest = create(wx.request)
const wxUpload = createUpload(wx.uploadFile)
const wxDownload = createUpload(wx.DownloadFile)

prequest('/api')

wxUpload('/upload')

wxDownload('/download')
```

### 其他

Token 校验、错误重试、取消请求、获取原生实例等请参阅 [@prequest/miniprogram](/miniprogram) 篇，用法都是一样的。

## 请求配置项

上传、请求配置项一致

| Option Name              | Type                                       | Default | Required | Meaning        | Example                           |
| ------------------------ | ------------------------------------------ | ------- | -------- | -------------- | --------------------------------- |
| path                     | string                                     | none    | Y        | 接口地址       | /audio/123                        |
| baseURL                  | string                                     | none    | N        | 服务端地址     | 'http://localhost:3000'           |
| url                      | string                                     | none    | N        | 服务端接口地址 | 'http://localhost:3000/audio/123' |
| getNativeRequestInstance | (value: Promise\<NativeInstance\>) => void | none    | N        | 获取原生请求   |                                   |
| cancelToken              | CancelToken                                | none    | N        | 取消请求       |                                   |
| header                   | object                                     | none    | N        | 请求头         | { token: 'aaaaa'}                 |

下面演示 `path`、`baseURL` 与 `url` 参数的区别，demo 中的请求都是等价的

```ts
prequest('http://localhost:3000/audio/123')

prequest('/audio/123', { baseURL: 'http://localhost:3000' })

prequest({ path: 'http://localhost:3000/audio/123' })

prequest({ path: '/audio/123', baseURL: 'http://localhost:3000' })

prequest({ url: 'http://localhost:3000/audio/123' })
```

---

此外，你也可以添加一些原生 API 支持的配置项，这部分配置项将会直接传递到原生 API 方法中。

示例:

```ts
interface Request {
  name?: string
  filePath?: string
  formData?: CommonObject
  timeout?: number
}

interface Response {}

const instance = createDownload<Request, Response>(wx.downloadFile, {
  baseURL: 'http://localhost:3000'
  name: 'filename' // You can get intelliSense here
})

// You can get intelliSense here
instance.use(async (ctx, next) => {
  ctx.request.name
  await next()
})
```
