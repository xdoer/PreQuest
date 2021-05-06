# @prequest/core

Provide A Modular And Pluggable Solution For Your Native Http Request.

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

Define a adapter function that contain native request core

```ts
const adapter = opt => nativeRequestCore(opt)
```

Create PreQuest instance and initiate an http request

```ts
const prequest = createPreQuest(adapter, opt)
prequest.get('/api')
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
```

PreQuest will merge `PreQuest.defaults`, `createPreQuest(adapter, opt)` and `instance.get('/api', opt)` three part's request options, and travel it to all middleware, finally inject `adapter` function. If you don't know what is meaning, see blow.

### Create A PreQuest Instance

Create a PreQuest instance with your adapter.

```ts
import { createPreQuest } from '@prequest/core'

const opt = { baseURL: 'http://localhost:3000' }
const prequest = createPreQuest<Request, Response>(adapter, opt)
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

[Notice]: if you want to use interceptor like axios, see this: [@prequest/interceptor](https://github.com/xdoer/PreQuest/blob/main/packages/interceptor/README.md)

### Global Config And Middleware

You can add global request options and use global middleware to intercept request and response.

```ts
import { PreQuest } from '@prequest/core'

// global request option
PreQuest.defaults.baseURL = 'http://localhost:3000'

// global middleware
PreQuest.use<Request, Response>(async (ctx, next) => {
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
