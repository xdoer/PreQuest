# 在 Taro 中使用

## 配置

```ts
<!--src/common/http-->
import Taro, { getStorageSync, navigateTo, removeStorageSync, setStorageSync } from '@tarojs/taro'
import { create, PreQuest, Request, Response } from '@prequest/miniprogram'
import errorRetryMiddleware from '@prequest/error-retry'
import cacheMiddleware, { CacheInject } from '@prequest/cache'
import timeoutMiddleware, { TimeoutInject } from '@prequest/timeout'
import InterceptorMiddleware from '@prequest/interceptor'
import Lock from '@prequest/lock'

// 注入自定义请求类型
interface CustomRequest {
  skipTokenCheck?: boolean
}

type InjectRequest = CustomRequest & TimeoutInject<Request> & CacheInject
type RequestOption = Request & InjectRequest

// 全局配置
PreQuest.defaults.baseURL = 'http://localhost:3000'
PreQuest.defaults.header = {}

// 全局中间件
PreQuest.use<RequestOption, Response>(async (ctx, next) => {
  console.log(ctx.request)
  await next()
  console.log(ctx.response)
})

export const prequest = create<InjectRequest, {}>(Taro.request, { method: 'GET', timeout: 5000 })

// 中间件
// 错误重试中间件
const errorRetry = errorRetryMiddleware<RequestOption, {}>({
  retryCount: 3,
  retryControl(opt， e) {
    // 这个错误是下面 parse 中间件抛出的
    if(e.message === '401') {
      // 如果是 401 请求未认证报错，则清除 token, 这样会重新请求 token 接口，拿到最新的 token 值
      lock.clear()
    }
    // 只有 GET 请求才走错误重试
    return opt.method === 'GET'
  }
})

// 缓存中间件
const cache = cacheMiddleware<RequestOption, {}>({
  cacheId(opt) {
    const { path, method } = opt
    return `${path}-${method}`
  },
  cacheControl(opt) {
    // 只有 GET 请求才会缓存
    return opt.method === 'GET'
  }
})

// 无痕刷新 token 中间件
export const lock = new Lock({
  getValue() {
    return getStorageSync('token')
  },
  setValue(token) {
    setStorageSync('token', token)
  },
  clearValue() {
    removeStorageSync('token')
  }
})
const wrapper = Lock.createLockWrapper(lock)

const refreshToken = async (ctx, next) => {
  if (ctx.request.skipTokenCheck) return next()
  const token = await wrapper(() => prequest('/token', { skipTokenCheck: true }).then(res => res.data))
  ctx.request.header['Authorization'] = token
  await next()
}

// 超时中间件
const timeout = timeoutMiddleware({
  timeout: 5000,
  timeoutControl() {
    // 只有微信小程序端的 timeout 由中间件处理
    // 其他端的由内核处理
    return process.env.TARO_ENV === 'weapp'
  }
})

// 解析响应
const parse = async (ctx, next) => {
  await next()
  // 用户服务器返回 401, 微信不会抛出异常、需要用户自己处理
  // 这里抛出异常，会被错误重试中间件捕获
  const { statusCode } = ctx.response
  if (![200, 301, 302].includes(statusCode)) {
    throw new Error('' + statusCode)
  }
}

// 注册实例中间件
prequest
  .use(errorRetry)
  .use(cache)
  .use(refreshToken)
  .use(timeout)
  .use(parse)

// 如果你习惯 axios 拦截器
const interceptor = new InterceptorMiddleware<RequestOption, Response>()
// 请求拦截器
interceptor.request.use(
  (req) => {
    if (req.path === '/api') {
      req.path = req.path + '?v=1'
    }
    return req
  }
)

// 响应拦截器
interceptor.response.use(
  (res) => {
    if (res.statusCode !== 200) throw new Error('' + res.statusCode)
    return res
  },
  (err) => {
    // 错误处理
    switch (err.message) {
      case '401':
        return navigateTo({ url: '/login' })
      // 注意将 err 抛出
      default:
        throw err
    }
  }
)

```

## 使用

### 发起请求

```ts
prequest('/api')

prequest.request('/api', { method: 'rpc' })

prequest.get('/api')
```

### 错误重试

```ts
prequest('/api', {
  retryCount: 3000,
})
```

### 超时时间

```ts
prequest('/api', {
  timeout: 3000,
})
```

### 缓存

```ts
prequest('/api', {
  useCache: true,
})
```
