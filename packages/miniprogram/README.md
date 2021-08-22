# @prequest/miniprogram

泛小程序请求库.支持各个小程序平台、快应用、鸿蒙

## 安装

```bash
npm install @prequest/miniprogram
```

## 使用

由于在不同平台上使用基本一致，所以基本使用文档，请查阅 [这里](https://pre-quest.vercel.app/usage?id=%e5%bc%80%e7%ae%b1%e5%8d%b3%e7%94%a8)

### 原生请求实例

```ts
import { PreQuest, create } from '@prequest/miniprogram'

const prequest = create(wx.request)

prequest('/api', {
  getNativeRequestInstance(promise) {
    promise.then(nativeRequest => {
      // nativeRequest 为实际发起请求的 wx.request
      nativeRequest.onHeadersReceived(res => {
        console.log('响应头', res.header)
      })
    })
  },
})
```

## 请求配置项

!> 下面的列表中，PreQuest 只会处理标注为 👍 的参数，其他参数将直接传入到原生请求实例。这意味着，原生请求实例不支持的参数，传入其中将无效。

| Option Name              | Type                              | Default | Required | Handle | Meaning                                 |
| ------------------------ | --------------------------------- | ------- | -------- | ------ | --------------------------------------- |
| path                     | string                            | none    | Y        | 👍     | server interface path                   |
| method                   | string                            | GET     | N        | 👎     | request method                          |
| baseURL                  | string                            | none    | N        | 👍     | base server interface address           |
| getNativeRequestInstance | (value: Promise\<any\>) => void   | none    | N        | 👍     | get native request instance             |
| cancelToken              | CancelToken                       | none    | N        | 👍     | cancel a request                        |
| timeout                  | number                            | none    | N        | 👎     | request timeout                         |
| params                   | object                            | none    | N        | 👍     | url parameters                          |
| data                     | object                            | none    | N        | 👎     | the data to be sent as the request body |
| responseType             | json \| text \| arraybuffer \|... | none    | N        | 👎     | response data type                      |
| header                   | object                            | none    | N        | 👎     | set the request header                  |
| dataType                 | json \| ...                       | none    | N        | 👎     | returned data format                    |

---

此外，你也可以添加一些原生 API 支持的配置项，这部分配置项将会直接传递到原生 API 方法中。

示例:

```ts
interface Request {
  enableHttp2?: boolean
  enableCache?: boolean
}

interface Response {
  header: any
  cookies: string[]
  profile: any
}

const instance = create<Request, Response>(wx.request, {
  baseURL: 'http://localhost:3000'
  enableHttp2: true // You can get intelliSense here
})

// You can get intelliSense here
instance.use(async (ctx, next) => {
  ctx.request.enableHttp2
  await next()
  ctx.response.header
})
```
