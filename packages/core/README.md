# @prequest/core

Provide a modular and pluggable solution for your request library.

## Example

You only need provide a `adapter` function which include a request core. Then you get can global request config, middleware, request alias...

```ts
import { createPreQuest, PreQuest } from '@prequest/core'

function adapter(opt) {
  const { path, baseURL, ...rest } = opt
  const url = baseURL + path
  return fetch(url, rest).then(res => res.json())
}

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
const instance = createPreQuest(adapter, opt)

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
