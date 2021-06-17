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

### 终止请求

如何取消请求

```ts
import { prequest } from '@prequest/xhr'
import CancelToken from '@prequest/cancel-token'

const source = CancelToken.source()

prequest.post('/api', {
  cancelToken: source.token

  getNativeRequestInstance(promise) {
    promise.then(xhr => {
      xhr.abort()
    })
  },
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
