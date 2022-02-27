# @prequest/miniprogram-addon

小程序附加包.提供了上传和下载文件的封装，可以与 `@prequest/miniprogram` 共享全局配置、全局中间件等功能。

## 安装

```bash
npm install @prequest/miniprogram-addon
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

prequest('/audio/123', { header: { token: '123' } }).then(res => {
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

---

此外，你也可以添加一些原生 API 支持的配置项，这部分配置项将会直接传递到原生 API 方法中。

示例:

```ts
declare module '@prequest/types' {
  interface PQRequest {
    name?: string
    filePath?: string
    formData?: Common
    timeout?: number
  }

  interface PQResponse {
    header: any
    cookies: string[]
    profile: any
  }
}

const instance = createDownload(wx.downloadFile, {
  baseURL: 'http://localhost:3000'
  name: 'filename' // You can get intelliSense here
})

// You can get intelliSense here
instance.use(async (ctx, next) => {
  ctx.request.name
  await next()
})
```

## 兼容

小程序中使用 async/await 需要安装 [regenerator-runtime@0.11.1](https://www.npmjs.com/package/regenerator-runtime/v/0.11.1)，框架包一般会内置这个依赖，如果没有，请自行安装，使用方式请在对应论坛进行查找。此外，由于包都是 ES6 版本的，在某些手机上可能有兼容性问题，你可以[查阅这里编译代码](https://pre-quest.vercel.app/#/compatible?id=webpack-chain)
