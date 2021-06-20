# @prequest/fetch

基于 fetch API 的请求库

## Install

```bash
npm install @prequest/fetch
```

## 基础用法

```ts
import { prequest } from '@prequest/fetch'

prequest('http://localhost:3000/api', { method: 'post' })

prequest.post('http://localhost:3000/api')
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
prequest('/api', { baseURL: 'http://localhost:3000/api' })

prequest({ path: '/api', baseURL: 'http://localhost:3000/api' })

// request by alias
prequest.get('/api', { baseURL: 'http://localhost:3000/api' })
```

### 自定义实例

```ts
import { create } from '@prequest/fetch'

// create instance
const opt = { baseURL: 'http://localhost:3000' }
const instance = create(opt)

// instance middleware
instance.use(async (ctx, next) => {
  ctx.request.path = '/prefix' + ctx.request.path
  await next()
  ctx.response = JSON.parse(ctx.response)
})

// request
instance('/api', { baseURL: 'http://localhost:3000/api' })
instance({ path: '/api', baseURL: 'http://localhost:3000/api' })

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

### 取消请求

```ts
import { prequest } from '@prequest/xhr'
import CancelToken from '@prequest/cancel-token'

const source = CancelToken.source()

prequest.post('/api', {
  cancelToken: source.token,
})

source.cancel()
```

注意：这里不建议自己使用 abortController 来取消请求，因为当你调用 AbortController.abort() 时，不确定内部是否执行到 fetch 中间件。

### 其他

Token 刷新;接口缓存;错误重试等功能请查阅相关章节

## 参数

| Option Name  | Type                              | Default | Required | Meaning                            | Example                 |
| ------------ | --------------------------------- | ------- | -------- | ---------------------------------- | ----------------------- |
| path         | string                            | none    | Y        | 接口路径                           | /api                    |
| method       | string                            | GET     | N        | 请求方式                           | post                    |
| baseURL      | string                            | none    | N        | 服务器地址                         | 'http://localhost:3000' |
| cancelToken  | CancelToken                       | none    | N        | 取消请求                           |                         |
| timeout      | number                            | none    | N        | 请求超时                           | 5000                    |
| params       | object                            | none    | N        | url 参数                           | { id: 10}               |
| data         | object                            | none    | N        | 请求头传输数据                     | { id: 10}               |
| responseType | json \| text \| arraybuffer \|... | none    | N        | 响应的数据类型                     | json                    |
| requestType  | json \| text \| arraybuffer \|... | none    | N        | 请求的数据类型，用以自动设置请求头 | json                    |
| header       | object                            | none    | N        | 请求头                             | { token: 'aaaaa'}       |

其他 fetch 原生支持的参数也支持传入

**注意**: 如果你用别名的方式调用一个 HTTP 请求， 就像 `instance.get('/api')` 这样， 那么你不需要传入 `path` 和 `method` 参数到选项中。
