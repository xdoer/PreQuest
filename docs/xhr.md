# @prequest/xhr

一个基于 XMLHttpRequest 的请求库

## 安装

```bash
npm install @prequest/xhr
```

## 原生请求

首先看一下 `XMLHttpRequest` 的原生用法

```ts
const xhr = new XMLHttpRequest()
xhr.open('GET', 'http://localhost:3000')
xhr.responseType = 'json'
xhr.onload = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
    resolve(xhr.response)
  } else {
    reject(xhr)
  }
}
xhr.send()
```

## 基本使用

```ts
import { prequest } from '@prequest/xhr'

prequest.request('http://localhost:3000/api')

// prequest.request shortcut
prequest('http://localhost:3000/api')

prequest.post('http://localhost:3000/api')
```

## 高级使用

### 全局配置

```ts
import { PreQuest } from '@prequest/xhr'

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
import { prequest } from '@prequest/xhr'

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

### 自定义请求实例

```ts
import { create } from '@prequest/xhr'

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
import { PreQuest, create, prequest } from '@prequest/xhr'
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

如何取消请求

```ts
import { prequest } from '@prequest/xhr'
import CancelToken from '@prequest/cancel-token'

const source = CancelToken.source()

prequest.post('/api', {
  cancelToken: source.token,
})

source.cancel()
```

### 获取原生请求实例

```ts
import { prequest } from '@prequest/xhr'

prequest.post('/api', {
  getNativeRequestInstance(promise) {
    promise.then(xhr => {
      xhr.abort()
    })
  },
})
```

### 其他

Token 刷新;接口缓存;错误重试等功能请查阅相关章节

## 参数

| Option Name              | Type                                       | Default | Required | Meaning                            | Example                 |
| ------------------------ | ------------------------------------------ | ------- | -------- | ---------------------------------- | ----------------------- |
| path                     | string                                     | none    | Y        | 接口路径                           | /api                    |
| method                   | string                                     | GET     | N        | 请求方式                           | post                    |
| baseURL                  | string                                     | none    | N        | 服务器地址                         | 'http://localhost:3000' |
| getNativeRequestInstance | (value: Promise\<NativeInstance\>) => void | none    | N        | 获取原生请求实例                   |                         |
| cancelToken              | CancelToken                                | none    | N        | 取消请求                           |                         |
| timeout                  | number                                     | none    | N        | 请求超时                           | 5000                    |
| params                   | object                                     | none    | N        | url 参数                           | { id: 10}               |
| data                     | object                                     | none    | N        | 请求头传输数据                     | { id: 10}               |
| responseType             | json \| text \| arraybuffer \|...          | none    | N        | 响应的数据类型                     | json                    |
| requestType              | json \| text \| arraybuffer \|...          | none    | N        | 请求的数据类型，用以自动设置请求头 | json                    |
| header                   | object                                     | none    | N        | 请求头                             | { token: 'aaaaa'}       |
| withCredentials          | boolean                                    | none    | N        | 认证                               |                         |
| onDownloadProgress       | (e) => void                                | none    | N        | 下载进度                           |                         |
| onUploadProgress         | (e) => void                                | none    | N        | 上传进度                           |                         |

**注意**: 如果你用别名的方式调用一个 HTTP 请求， 就像 `instance.get('/api')` 这样， 那么你不需要传入 `path` 和 `method` 参数到选项中。
