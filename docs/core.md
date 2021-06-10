# @prequest/core

为你的 Http 请求提供模块化可插拔的解决方案。

## Introduction

如果你使用类似 axios、umi-request 或者其他请求库，或许你不需要这个。但如果你使用原生的请求 API(XMLHttpRequest、fetch、node http.request 或者 小程序，快应用原生请求)。这个库可以很方便的为这些原生请求 API 添加中间件、拦截器、全局配置、别名请求等等特性。

这个库不包含原生请求的 API，这意味着你不能通过这个库进行 http 调用。

既然如此，这个库怎么用？

## 安装

```bash
npm install @prequest/core
```

## 基础用法

```ts
import { PreQuest } from '@prequest/core'

/**
 * 你需要实现一个基于原生请求 API 的适配器
 * 这里基于你的实际需求，定义 opt 参数，但注意只能是一个对象。
 * 使用未指定参数的请求方式 `eg:prequest.post('/api')`, PreQuest 会向你的参数中混入`path` 和 `method` 参数。
 * */
const adapter = opt => nativeRequestCore(opt)

const prequest = PreQuest.create(adapter)
prequest('http://localhost:3000/api')
prequest.get('http://localhost:3000/api')
prequest.request('http://localhost:3000/api')
```

## 高级用法

### 定义适配器函数

你需要提供一个包含原生请求 API 的 `adapter` 方法。

首先，你需要定义 `adapter` 函数类型

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

接着，实现 `adapter` 函数

```ts
const adapter: Adapter = opt => nativeRequestCore(opt)
```

PreQuest 将会合并 `PreQuest.defaults`, `PreQuest.create(adapter, opt)` 和 `instance.get('/api', opt)` 这三个部分的对象，生成请求的配置项，最后传入到 `adapter` 函数中。如果你不明白这是什么意思，先接着往下看。

### 执行一个 HTTP 请求

用你定义的 `adapter` 函数创建一个 PreQuest 实例。

```ts
import { PreQuest } from '@prequest/core'

const opt = { baseURL: 'http://localhost:3000' }
const prequest = PreQuest.create<Request, Response>(adapter, opt)
```

接着，你就可以用这个实例进行 HTTP 请求。

```ts
// 使用 request api
prequest.request('/api', { method: 'post' })
prequest.request({ path: '/api', method: 'post' })

// 使用 prequest.request 简写
prequest('/api', { method: 'post' })
prequest({ path: '/api', method: 'post' })

// 通过别名请求
// 支持： get、post、delete、put、patch、head、options 别名
prequest.post('/api')
```

### 拦截请求与响应

你可以通过中间件修改参数和响应

```ts
prequest.use(async (ctx, next) => {
  // 修改参数
  ctx.request.path = '/prefix' + ctx.request.path
  await next()
  // 修改响应
  ctx.response.data = JSON.parse(ctx.response.data)
})
```

**注意**: 如果你想使用类似 axios 中的拦截器，你可以看看这个: [@prequest/interceptor](https://github.com/xdoer/PreQuest/blob/main/packages/interceptor/README.md)

### 全局配置和拦截器

你可以添加全局配置项，并且使用全局中间件修改请求和响应。

```ts
import { PreQuest } from '@prequest/core'

// 全局请求配置项
PreQuest.defaults.baseURL = 'http://localhost:3000'

// 全局中间件
PreQuest.use<Request, Response>(async (ctx, next) => {
  ctx.request.path = '/prefix' + ctx.request.path
  await next()
  ctx.response.data = JSON.parse(ctx.response.data)
})
```

## 更多

这里有几个基于 PreQuest 的请求库可以参考:

> - [@prequest/fetch](https://github.com/xdoer/PreQuest/blob/main/packages/fetch/README.md). A request library base on fetch api.
> - [@prequest/xhr](https://github.com/xdoer/PreQuest/blob/main/packages/xhr/README.md). A request library base on XMLHttpRequest api.
> - [@prequest/miniprogram](https://github.com/xdoer/PreQuest/blob/main/packages/miniprogram/README.md). A request library base on miniprogram or quickapp.
> - [@prequest/node](https://github.com/xdoer/PreQuest/blob/main/packages/node/README.md). A request library base on node http and https api.
