# @prequest/fetch

基于 fetch API 的请求库

## Install

```bash
npm install @prequest/fetch
```

## 基础用法

```ts
import { prequest } from '@prequest/fetch'

prequest('http://localhost:10000/api', { method: 'post' })

prequest.post('http://localhost:10000/api')
```

## 高级用法

### 全局配置

```ts
import { PreQuest } from '@prequest/fetch'

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
import { prequest } from '@prequest/fetch'

// instance middleware
prequest.use(async (ctx, next) => {
  ctx.request.path = '/prefix' + ctx.request.path
  await next()
  ctx.response = JSON.parse(ctx.response)
})

// request
prequest('/api', { baseURL: 'http://localhost:3001/api' })

prequest({ path: '/api', baseURL: 'http://localhost:3001/api' })

// request by alias
prequest.get('/api', { baseURL: 'http://localhost:3001/api' })
```

### 自定义实例

```ts
import { create } from '@prequest/fetch'

// create instance
const opt = { baseURL: 'http://localhost:3001' }
const instance = create(opt)

// instance middleware
instance.use(async (ctx, next) => {
  ctx.request.path = '/prefix' + ctx.request.path
  await next()
  ctx.response = JSON.parse(ctx.response)
})

// request
instance('/api', { baseURL: 'http://localhost:3001/api' })
instance({ path: '/api', baseURL: 'http://localhost:3001/api' })

// request by instance
instance.get('/api')
```

## 拦截器

如果你想像 axios 一样使用拦截器，你可以像下面这样操作，否则注册一个中间件可以满足你的需求。

```ts
import { PreQuest, create, prequest } from '@prequest/fetch'
import interceptorMiddleware from '@prequest/interceptor'

// create Interceptor instance
const interceptor = new Interceptor()

// use
interceptor.request.use(
  requestOpt => modify(requestOpt),
  err => handleErr(err)
)

// mount global interceptor middleware
PreQuest.use(interceptor.run)

// or you can mount it to prequest instance
prequest.use(interceptor.run)

// or you can mount it to custom prequest instance
const instance = create()
instance.use(interceptor.run)
```
