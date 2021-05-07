# @prequest/fetch

A Modern Request Library Based On Fetch API.

## Example

### Native Fetch

First, let us see how to use native fetch.

```ts
fetch('http://localhost:3000', { ...opt })
  .then(res => res.json())
  .then(resInfo => console.log(resInfo))
```

### Basic Usage

How to use this library ?

```ts
import { create, PreQuest } from '@prequest/fetch'

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
const instance = create(opt)

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
import { PreQuest, create } from '@prequest/fetch'
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
const instance = create()
instance.use(interceptor.run)
```

More Detail: [@prequest/interceptor](https://github.com/xdoer/PreQuest/blob/main/packages/interceptor/README.md)

### Abort

How to abort a request?

```ts
import { create } from '@prequest/fetch'

const controller = new AbortController()
const signal = controller.signal

const instance = create()

instance.post('/api', { signal })

setTimeout(() => {
  controller.abort()
})
```
