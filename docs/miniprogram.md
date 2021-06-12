# @prequest/miniprogram

小程序请求库.

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
import { InterceptorMiddleware } from '@prequest/interceptor'

// create Interceptor instance
const interceptor = new InterceptorMiddleware()

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

可以使用获得原生实例请求的方式取消请求。

此外，还可以使用 `cancelToken` 来取消请求

方式一:

```ts
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

```ts
import { create } from '@prequest/miniprogram'
import { CancelToken } from '@prequest/cancel-token'

const instance = create(wx.request)

let cancel

instance.request({
  path: '/api',
  cancelToken: new CancelToken(c => (cancel = c)),
})

cancel()
```

### 缓存数据

缓存接口数据

```ts
import { create, Request, Response } from '@prequest/miniprogram'
import { CacheMiddleware } from '@prequest/cache'

const cacheMiddleware = new CacheMiddleware<Request, Response>({
  ttl: 5000,
  cacheId(opt) {
    const { path, method } = opt
    return `${method}-{path}`
  },
  validateCache(opt) {
    const { path } = opt
    if(path === '/api') return true
    return false
  },
  cacheKernel() {
    const map = new Map()
    return {
      set: map.set,
      get: map.get,
      clear: map.clear
      delete: map.delete
    }
  }
})

const instance = create(wx.request)

instance.use(cacheMiddleware.run)

// 只要成功接收到服务器返回，无论 statusCode 是多少，都会进入 success 回调，所以需要处理
// https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html
instance.use(async (ctx, next) => {
  await next()
  const { statusCode, data } = ctx.response
  if(statusCode === 500) {
    throw new Error(data)
  }
})
```

### 刷新 Token

静默刷新 token

```ts
import { create, Request, Response } from '@prequest/miniprogram'
import { createLockWrapper, Lock } from '@prequest/lock'

const lockWrapper = createLockWrapper()
const lock = new Lock()

const wxRequest = create(wx.request)

// 创建一个实例，该实例不会走中间件。否则会造成 bug
const tokenRequest = create(wx.request)

function getToken() {
  return tokenRequest('http://localhost:3000/token').then(res => res.data.token)
}

wxRequest.use(async (ctx, next) => {
  // lockWrapper 会将所有请求拦截在这里，直到获取到 token 之后才放行
  const token = await lockWrapper(getToken, lock)
  ctx.request.headers['Authorization'] = `bearer ${token}`
  await next()
})

function getData() {
  return wxRequest.get('/api').catch(e => {
    // token 失效，需要将 lock.value 置为空，以便中间件重新生成 token
    if (e.statusCode === '401') {
      lock.value = null
      getData()
    }
  })
}
```

这里可以结合错误重试中间件，自动进行接口重新调用，详情参考[@prequest/lock](/lock)

### 错误重试

```ts
import { create, Request, Response } from '@prequest/miniprogram'
import { ErrorRetryMiddleware } from '@prequest/error-retry'
import { isCancel } from '@prequest/cancel-token'

const prequest = create(wx.request)

const errorRetryMiddleware = new ErrorRetryMiddleware<Request, Response>({
  retryCount: 3,
  retryControl(opt, error) {
    const { method, path } = opt

    // 使用 cancelToken 取消的请求不进行错误重试
    if (isCancel(error)) return false

    // 指定的路径不使用错误重试
    if (path === '/api') return false

    // get 请求使用错误重试
    return method === 'get'
  },
})

prequest.use(errorRetryMiddleware.run)

prequest.get('/api')
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
