# @prequest/xhr

A Modern Request Library Based On XMLHttpRequest.

## Introduction

This is a http request library based on PreQuest. This library add middleware, interceptor, global config, request alias and some other feature to `XMLHttpRequest` request api.

## Install

```bash
npm install @prequest/xhr
```

## Native Usage

First, let us see how to use native XMLHttpRequest.

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

## Basic Usage

```ts
import { prequest } from '@prequest/xhr'

prequest.request('http://localhost:3000/api')

// prequest.request shortcut
prequest('http://localhost:3000/api')

prequest.post('http://localhost:3000/api')
```

## Advanced Usage

### Global Config

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

### Instance Config

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

### Custom Instance

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

## Interceptor

If you want to use interceptor like axios, you may need this, or middleware can meet your demand.

```ts
import { PreQuest, create, prequest } from '@prequest/xhr'
import { interceptorMiddleware } from '@prequest/interceptor'

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

More Detail: [@prequest/interceptor](https://github.com/xdoer/PreQuest/blob/main/packages/interceptor/README.md)

### Abort

How to abort a request?

```ts
import { prequest } from '@prequest/xhr'

let nativeRequestInstance
prequest.post('/api', {
  getRequestInstance(instance) {
    nativeRequestInstance = instance
  },
})

setTimeout(() => {
  nativeRequestInstance.abort()
})
```
