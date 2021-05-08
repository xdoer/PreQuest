# @prequest/core

A modular and pluggable solution for native http request.

## Introduction

If you use axios、umi-request or some other http request library, you may don't need this. But if you use native request api like XMLHttpRequest, fetch and so on, This library can add middleware, interceptor, global config, request alias and some modern feature to it easily.

This library does not contain a native request core which mean that you can't call a http request according this.

But how to use this ?

Let see blow.

## Install

```bash
npm install @prequest/core
```

## Quick Start

```ts
import { create } from '@prequest/miniprogram'

// you need implement this function with a native request core like XMLHttpRequest, fetch ...
const adapter = opt => nativeRequestCore(opt)

const prequest = create(adapter)
prequest.get('http://localhost:3000/api').then(res => console.log(res))
```

## More Detail

### Define A Adapter Function

You need provide a `adapter` function which contain a native request core.

First: Define the types of adapter function

```ts
interface Request {
  path: string
  method?: string
  baseURL?: string
}

interface Response {
  data: string
  status: number
}

type Adapter = (opt: Request) => Promise<Response>
```

Then: Implement this function

```ts
const adapter: Adapter = opt => nativeRequestCore(opt)

/**
 * eg:
 * const nativeRequestCore = (opt) => fetch(opt).then(res => res.json())
 * /
```

PreQuest will merge `PreQuest.defaults`, `create(adapter, opt)` and `instance.get('/api', opt)` three part's request options, and travel it to all middleware, finally inject `adapter` function. If you don't know what's this meaning, see blow.

### Create A PreQuest Instance

Create a PreQuest instance with your adapter.

```ts
import { create } from '@prequest/core'

const opt = { baseURL: 'http://localhost:3000' }
const prequest = create<Request, Response>(adapter, opt)
```

Then, you can call a http request with this instance.

```ts
// use request api
prequest.request({ path: '/api', method: 'get' })

// use request alias
// support get、post、delete、put、patch、head、options
prequest.get('/api')
```

### Intercept Request And Response

You can modify your request options or response with build-in middleware.

```ts
prequest.use(async (ctx, next) => {
  // modify request options
  ctx.request.path = '/prefix' + ctx.request.path
  await next()
  // handle response data
  ctx.response.data = JSON.parse(ctx.response.data)
})
```

**Notice**: if you want to use interceptor like axios, see this: [@prequest/interceptor](https://github.com/xdoer/PreQuest/blob/main/packages/interceptor/README.md)

### Global Config And Middleware

You can add global request options and use global middleware to intercept request and response.

```ts
import { PreQuestBase } from '@prequest/core'

// global request option
PreQuestBase.defaults.baseURL = 'http://localhost:3000'

// global middleware
PreQuestBase.use<Request, Response>(async (ctx, next) => {
  // modify request options
  ctx.request.path = '/prefix' + ctx.request.path
  await next()
  // handle response data
  ctx.response.data = JSON.parse(ctx.response.data)
})
```

## More Examples

There are several demo for reference.

> - [@prequest/xhr](https://github.com/xdoer/PreQuest/blob/main/packages/xhr/README.md). A request library base on XMLHttpRequest api.
> - [@prequest/fetch](https://github.com/xdoer/PreQuest/blob/main/packages/fetch/README.md). A request library base on fetch api.
> - [@prequest/miniprogram](https://github.com/xdoer/PreQuest/blob/main/packages/miniprogram/README.md). A request library base on miniprogram or quickapp.
> - [@prequest/node](https://github.com/xdoer/PreQuest/blob/main/packages/node/README.md). A request library base on node http and https api.
