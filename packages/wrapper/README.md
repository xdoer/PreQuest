English | [中文](./README_zh-CN.md)

# @prequest/wrapper

A wrapper which can enhance the request method you defined.

## Introduction

When we define a request method based on fetch, XMLHttpRequest, etc. And used it extensively in a project. The cost of switching to PreQuest is relatively high. This project can be very convenient, adding middleware, global configuration and other PreQuest features to it without basically invading the request method you defined.

## Install

```bash
npm install @prequest/wrapper
```

## Usage

### First: define a request method

```ts
function ajax(params) {
  const { path, method, baseURL, ...rest } = params

  // ...some code
}
```

### Next: Wrapper the method

```ts
import { wrapper } from '@prequest/wrapper'

const ajax = wrapper(function(params) {
  const { path, method, baseURL, ...rest } = params

  // some code
})
```

### Then: Enjoy it

You can use it as normal

```ts
ajax({ path: 'http://localhost:1000/api', method: 'get', params: { a: 'aaa' } })
```

use the PreQuest ability

```ts
ajax('http://localhost:1000/api', { method: 'get', params: { a: 'aaa' } })

ajax.get('http://localhost:1000/api', { params: { a: 'aaa' } })

ajax.use(async (ctx, next) => {
  console.log(ctx.request)
  await next()
  console.log(ctx.response)
})
```

create instance

```ts
const instance = ajax.create({ baseURL: 'http://localhost:1000' })

instance.get('/api', { params: { a: 'aaa' } })

instance.use(async (ctx, next) => {
  console.log(ctx.request)
  await next()
  console.log(ctx.response)
})
```

global config

```ts
import { PreQuest } from '@prequest/wrapper'

PreQuest.defaults.baseURL = 'http://localhost:1000'

PreQuest.use(async (ctx, next) => {
  console.log(ctx.request)
  await next()
  console.log(ctx.response)
})
```

## Notice

The request method you defined must meet several conditions.

### Only One Params

`wrapper`'s callback only support one params, it's meaning that you should pass into a object params.

```ts
// not support
function ajax(path: string, method: string, opt: Option)

// support
function ajax({ path, method, opt })
```

### Mixin Params

If you perform a http request which you need not specify a param, PreQuest will mixin `path` or `method` into your request options.

```ts
// mixin `{ path : http://localhost:1000/api }` into your request options
ajax('http://localhost:1000/api')

// mixin `{ path : http://localhost:1000/api, method: post }` into your request options
ajax.post('http://localhost:1000/api')

// mixin `{ path : /api, method: post }` into your request options
ajax.get('/api')
```
