# @prequest/miniprogram

一个模块化的小程序请求库.

## 简介

这是一个基于 PreQuest 的小程序或快应用的请求库。这个库添加了中间件、拦截器、全局配置、请求别名等几个特性。

## 安装

```bash
npm install @prequest/miniprogram
```

## 原生请求

首先，看一下原生请求的 demo

```ts
const requestInstance = wx.request({
  url: 'http://localhost:3000/api',
  method: 'post',
  data: {
    x: '',
  },
  header: {
    'content-type': 'application/json',
  },
  success(res) {
    console.log(res.data)
  },
})

requestInstance.abort()
```

## 基本使用

```ts
import { create, PreQuest } from '@prequest/miniprogram'

// 传入原生方法。这样可以适配各个小程序平台
const prequest = create(wx.request)

prequest('http://localhost:3000/api').then(res => console.log(res))
prequest.get('http://localhost:3000/api').then(res => console.log(res))
```

## 高级使用

### 全局配置

```ts
import { create, PreQuest } from '@prequest/miniprogram'

// global config
PreQuest.defaults.baseURL = 'http://localhost:3000'

// global middleware
PreQuest.use(async (ctx, next) => {
  // modify request params
  console.log(ctx.request)
  await next()
  // handle response error or modify response data
  console.log(ctx.response)
})
```

### 实例配置

```ts
// instance config options
const opt = { baseURL: 'http://localhost:3001' }

// pass in native request core, so you can use this library in different miniprogram platform.
const instance = create(wx.request, opt)

// instance middleware
instance.use(async (ctx, next) => {
  ctx.request.path = '/prefix' + ctx.request.path
  await next()
  ctx.response = JSON.parse(ctx.response)
})

// request
instance.request({ path: '/api' })

// instance.request shortcut
instance('/api')

// request by alias
instance.get('/api')
```

### 拦截器

如果你想像 axios 一样使用拦截器

```ts
import { PreQuest, create } from '@prequest/miniprogram'
import { interceptorMiddleware } from '@prequest/interceptor'

// create Interceptor instance
const interceptor = new Interceptor()

// mount global interceptor middleware
PreQuest.use(interceptor.run)

// or you can mount it to prequest instance
const instance = create(wx.request)
instance.use(interceptor.run)

// use
interceptor.request.use(
  requestOpt => modify(requestOpt),
  err => handleErr(err)
)
```

更多请查看: [@prequest/interceptor](https://github.com/xdoer/PreQuest/blob/main/packages/interceptor/README.md)

### 原生请求实例

怎样获得原生请求实例?

```ts
import { PreQuest, create } from '@prequest/miniprogram'

const instance = create(wx.request)

instance.request({
  path: '/api',
  getNativeRequestInstance(promise) {
    promise.then(nativeRequest => {
      nativeRequest.abort()
    })
  },
})
```

### 取消请求

可以使用上一段落中，获得原生实例请求的方式取消请求。

此外，还可以使用 `cancelToken` 来取消请求

方式一:

```tsx
import { PreQuest, create } from '@prequest/miniprogram'
import { CancelToken } from '@prequest/cancel-token'

const instance = create(wx.request)

const source = CancelToken.source()

instance.request({
  path: '/api',
  cancelToken: source.token,
})

source.cancel()
```

方式二:

```tsx
import { PreQuest, create } from '@prequest/miniprogram'
import { CancelToken } from '@prequest/cancel-token'

const instance = create(wx.request)

let cancel

instance.request({
  path: '/api',
  cancelToken: new CancelToken(c => (cancel = c)),
})

cancel()
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

**注意**: 如果你用别名的方式调用一个 HTTP 请求， 就像 `instance.get('/api')` 这样， 那么你不需要传入 `path` 和 `method` 参数到选项中。

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

## 自定义

如果你想自定义你的请求库，使用 [@prequest/core](https://github.com/xdoer/PreQuest/tree/main/packages/core) 项目会很方便、很容易的封装一个你的请求库。
