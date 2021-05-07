# @prequest/miniprogram

A Modern MiniProgram Request Library.

## Introduction

This is a http request library based on PreQuest for miniprogram and quickapp platform. This library add middleware, interceptor, global config, request alias and some other feature to native request.

## Install

```bash
npm install @prequest/miniprogram
```

## Usage

### Native Request

First, let us see the demo how to call a http request by native api.

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

### Basic Usage

```ts
import { createPreQuest, PreQuest } from '@prequest/miniprogram'

const instance = createPreQuest(wx.request)

instance.get('http://localhost:3000/api')
```

### Advanced Usage

```ts
import { createPreQuest, PreQuest } from '@prequest/miniprogram'

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

// instance config options
const opt = { baseURL: 'http://localhost:3001' }

// pass in native request core, so you can use this library in different miniprogram platform.
const instance = createPreQuest(wx.request, opt)

// instance middleware
instance.use(async (ctx, next) => {
  ctx.request.path = '/prefix' + ctx.request.path
  await next()
  ctx.response = JSON.parse(ctx.response)
})

// request
instance.request({ path: '/api' })

// request by alias
instance.get('/api')
```

### Interceptor

If you want to use interceptor like axios, you may need this, or middleware can meet your demand.

```ts
import { PreQuest, createPreQuest } from '@prequest/miniprogram'
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
const instance = createPreQuest(wx.request)
instance.use(interceptor.run)
```

More Detail: [@prequest/interceptor](https://github.com/xdoer/PreQuest/blob/main/packages/interceptor/README.md)

### Native Request Instance

How to get native request instance so you can do something like abort ?

```ts
import { PreQuest, createPreQuest } from '@prequest/miniprogram'

const instance = createPreQuest(wx.request)

let requestInstance

instance.request({
  path: '/api',
  getRequestInstance(nativeRequestInstance) {
    requestInstance = nativeRequestInstance
  },
})

// must call requestInstance in next event loop
setTimeout(() => {
  requestInstance.abort()
})
```

## Request Options

| Option Name        | Type                              | Default | Required | Meaning                                 | Example                 |
| ------------------ | --------------------------------- | ------- | -------- | --------------------------------------- | ----------------------- |
| path               | string                            | none    | Y        | server interface path                   | /api                    |
| method             | string                            | GET     | N        | request method                          | post                    |
| baseURL            | string                            | none    | N        | base server interface address           | 'http://localhost:3000' |
| getRequestInstance | (nativeRequestInstance) => void   | none    | N        | get native request instance             |                         |
| timeout            | number                            | none    | N        | request timeout                         | 5000                    |
| params             | object                            | none    | N        | url parameters                          | { id: 10}               |
| data               | object                            | none    | N        | the data to be sent as the request body | { id: 10}               |
| responseType       | json \| text \| arraybuffer \|... | none    | N        | response data type                      | json                    |
| header             | object                            | none    | N        | set the request header                  | { token: 'aaaaa'}       |
| dataType           | json \| ...                       | none    | N        | returned data format                    | json                    |

NOTICE: If you call a request by alias like `instance.get('/api')` , you don't need pass `method` and `path` into options.

---

You can add some other options which native request api support. This part of options will be pass into native request options directly.

If you use typescript, you can define the options you want to attach, and pass it into `createPreQuest`. So you can get intelliSense when coding.

For example:

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

const instance = createPreQuest<Request, Response>(wx.request, {
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

## Custom

If you want to custom your miniprogram library, it's very easy when use [@prequest/core](https://github.com/xdoer/PreQuest/tree/main/packages/core) project. Please check our code for details.
