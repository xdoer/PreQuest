# @prequest/miniprogram

小程序请求库.

## 安装

```bash
npm install @prequest/miniprogram
```

## DEMO

[demo](https://github.com/xdoer/PreQuest/tree/main/examples/taro) 包含了下面提到的所有功能，感兴趣的可以拉下来看一下。

## 文档地址

这篇文档可能不会及时更新，使用方式以网站为准。

[https://pre-quest.vercel.app/#/miniprogram](https://pre-quest.vercel.app/#/miniprogram)

## 文章

> - [由封装一个请求库所想到的](https://aiyou.life/post/M4RcI3wfU/)
> - [设计一个可插拔的请求库?](https://juejin.cn/post/6960254713631604766)

## 原生请求

首先，看一下原生请求的 demo

```ts
const requestInstance = Taro.request({
  url: 'http://localhost:3000/api',
  method: 'POST',
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

const prequest = create(Taro.request)

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
const instance = create(Taro.request, opt)

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
import InterceptorMiddleware from '@prequest/interceptor'

// create Interceptor instance
const interceptor = new InterceptorMiddleware()

// mount global interceptor middleware
PreQuest.use(interceptor.run)

// or you can mount it to prequest instance
const instance = create(Taro.request)
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

const instance = create(Taro.request)

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
import CancelToken from '@prequest/cancel-token'

const instance = create(Taro.request)

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
import CancelToken from '@prequest/cancel-token'

const instance = create(Taro.request)

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
import CacheMiddleware from '@prequest/cache'

const cacheMiddleware = new CacheMiddleware<Request, Response>({
  ttl: 5000,
  cacheId(opt) {
    const { path, method } = opt
    return `${method}-${path}`
  },
  cacheControl(opt) {
    const { path } = opt
    if (path === '/api') return true
    return false
  },
  cacheKernel() {
    const map = new Map()
    return {
      set: map.set,
      get: map.get,
      clear: map.clear,
      delete: map.delete,
    }
  },
})

const instance = create(Taro.request)

instance.use(cacheMiddleware.run)

// 只要成功接收到服务器返回，无论 statusCode 是多少，都会进入 success 回调，所以需要处理
// https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html
instance.use(async (ctx, next) => {
  await next()
  const { statusCode, data } = ctx.response
  if (statusCode === 500) {
    throw new Error(data)
  }
})
```

### 刷新 Token

静默刷新 token

```js
import { create, Request, Response } from '@prequest/miniprogram'
import Lock from '@prequest/lock'

const prequest = create(uni.request)

// 创建 lock 实例
const lock = new Lock({
  async getValue() {
    return getStorageSync('token')
  },
  async setValue(token) {
    setStorageSync('token', token)
  },
  async clearValue() {
    removeStorageSync('token')
  },
})

// 用 lock 实例创建包裹器
const wrapper = Lock.createLockWrapper(lock)

prequest.use(async (ctx, next) => {
  // 自定义了一个参数 skipToken， 用以放行不需要 token 的接口
  if (ctx.request.skipToken) return next()

  /**
   * wrapper 会将所有请求拦截在这里，直到获取到 token 之后才放行
   * 获取 token 接口由于传入了 skipToken 所以不会
   * */
  const token = await wrapper(() =>
    prequest('/token', { skipToken: true }).then(res => res.data.token)
  )
  ctx.request.header = ctx.request.header || {}
  ctx.request.header['Authorization'] = `bearer ${token}`
  await next()
})

// 同时发起 5 个请求，等到 token 拿到后，才会执行
prequest('/api', { params: { a: 1 } })
prequest('/api', { params: { a: 2 } })
prequest('/api', { params: { a: 3 } })
prequest('/api', { params: { a: 4 } })
prequest('/api', { params: { a: 5 } })
```

这里可以结合错误重试中间件，自动进行接口重新调用，详情参考[@prequest/lock](https://pre-quest.vercel.app/#/lock)

### 错误重试

```ts
import { create, Request, Response } from '@prequest/miniprogram'
import ErrorRetryMiddleware from '@prequest/error-retry'

const prequest = create(Taro.request)

const errorRetryMiddleware = new ErrorRetryMiddleware<Request, Response>({
  retryCount: 3,
  retryControl(opt, error) {
    const { method, path } = opt

    // 指定的路径不使用错误重试
    if (path === '/api') return false

    // get 请求使用错误重试
    return method === 'GET'
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

const instance = create<Request, Response>(Taro.request, {
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

## 注意

在 Taro 中使用，需要小程序[支持 async, await](https://github.com/NervJS/taro/issues/5570)。

首先需要安装 `@tarojs/async-await`

接着要在入口文件中，引入 `import "@tarojs/async-await"`

然后需要在 `config/index.js` 中增加配置项

```bash
  alias: {
    'regenerator-runtime': path.resolve(__dirname, '../node_modules', 'regenerator-runtime'),
  },
```

其次，需要在 /config/index.js 文件中，配置编译 @prequest

```ts
const config = {
  // ...
  mini: {
    // ...
    compile: {
      include: [
        modulePath => {
          return modulePath.indexOf('@prequest') > -1
        },
      ],
    },
  },
}
```
