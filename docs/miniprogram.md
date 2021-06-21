# @prequest/miniprogram

小程序请求库.支持各个小程序平台

## 安装

```bash
npm install @prequest/miniprogram
```

## 使用

基本使用，请查阅 [文档](/usage?id=%e5%bc%80%e7%ae%b1%e5%8d%b3%e7%94%a8)

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

| Option Name              | Type                                       | Default | Required | Meaning                                 | Example                 |
| ------------------------ | ------------------------------------------ | ------- | -------- | --------------------------------------- | ----------------------- |
| path                     | string                                     | none    | Y        | server interface path                   | /api                    |
| method                   | string                                     | GET     | N        | request method                          | post                    |
| baseURL                  | string                                     | none    | N        | base server interface address           | 'http://localhost:3000' |
| getNativeRequestInstance | (value: Promise\<NativeInstance\>) => void | none    | N        | get native request instance             |                         |
| cancelToken              | CancelToken                                | none    | N        | cancel a request                        |                         |
| timeout                  | number                                     | none    | N        | request timeout                         | 5000                    |
| params                   | object                                     | none    | N        | url parameters                          | { id: 10}               |
| data                     | object                                     | none    | N        | the data to be sent as the request body | { id: 10}               |
| responseType             | json \| text \| arraybuffer \|...          | none    | N        | response data type                      | json                    |
| header                   | object                                     | none    | N        | set the request header                  | { token: 'aaaaa'}       |
| dataType                 | json \| ...                                | none    | N        | returned data format                    | json                    |

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
