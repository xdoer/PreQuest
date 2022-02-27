# @prequest/core

PreQuest 核心提供了中间件模型，配置合并，请求控制等核心功能，开发者可以很容易扩展出自己的请求库。

## 安装

```bash
npm install @prequest/core
```

## 快速入门

你只需要封装一个 adapter 函数，将其传入到 PreQuest 中，就成功封装了一个请求库。

### 封装

下面的 demo，演示了最简单的封装

```ts
<!-- myHttp.js -->

import { PreQuest } from '@prequest/core'

const adapter = opt => {
  const { path, ...options } = opt
  return fetch(path, options).then(res => res.json())
}

const prequest = PreQuest.create(adapter)

export { prequest, PreQuest }
```

### 使用

```ts
import { prequest, PreQuest } from './myHttp'

// 全局配置
PreQuest.defaults.headers = { token: '12345' }

// 全局中间件
PreQuest.use(async (ctx, next) => {
  console.log(ctx.request)
  await next()
  console.log(ctx.response)
})

// 发起请求
prequest('http://localhost:3000/api', {
  method: 'GET',
})

prequest.get('http://localhost:3000/api')

// 实例中间件
prequest.use(async (ctx, next) => {
  console.log(ctx.request)
  await next()
  console.log(ctx.response)
})
```

## 详细用法

### 适配器

首先，根据需求，完成一个 `adapter` 函数。

扩展请求和响应参数类型，以便用户在使用时，可以获得智能提示。

```ts
declare module '@prequest/types' {
  interface PQRequest {
    baseURL?: string
  }

  interface PQResponse {
    data: string
    status: number
  }
}
export {}
```

接着，进行 `adapter` 函数实现

```ts
import { Adapter } from '@prequest/types'

const adapter: Adapter = opt => {
  const { path, baseURL, ...options } = opt
  const url = baseURL + path
  return fetch(url, options).then(res => res.json())
}
```

PreQuest 将会合并 `PreQuest.defaults`, `PreQuest.create(adapter, opt)` 和 `instance.get('/api', opt)` 这三个部分的参数对象，生成请求的配置项，经过用户注册的中间件，最后传入到 `adapter` 函数中。

### 创建实例

用定义的 `adapter` 函数创建一个 PreQuest 实例。

```ts
import { PreQuest } from '@prequest/core'

const opt = { baseURL: 'http://localhost:3000' }
const prequest = PreQuest.create(adapter, opt)
```

### 执行请求

接着，就可以用这个实例进行 HTTP 请求。

```ts
// 使用 request api
prequest.request('/api', { method: 'POST' })
prequest.request({ path: '/api', method: 'POST' })

// 使用 prequest.request 简写
prequest('/api', { method: 'POST' })
prequest({ path: '/api', method: 'POST' })

// 通过别名请求
// 支持： get、post、delete、put、patch、head、options 别名
prequest.post('/api')
```

PreQuest 支持以下调用方式:

```text
prequest(config)

prequest(path[, config])

prequest#[request|get|post|delete|put|patch|head|options](path[, config])
```

这里 `config` 类型为 [适配器](#适配器)章节中定义的 `Request`

### 全局配置

你可以通过 `PreQuest.defaults` 添加全局配置项

```ts
import { PreQuest } from '@prequest/core'

// 全局请求配置项
PreQuest.defaults.baseURL = 'http://localhost:3000'
```

与 `axios` 不同的是， `PreQuest.default` 默认是一个空对象， PreQuest 不会对参数进行处理。

### 中间件

中间件有两种，全局中间件与实例中间件

#### 中间件使用

```ts
import { PreQuest } from '@prequest/core'

// 全局中间件
PreQuest.use(async (ctx, next) => {
  ctx.request.path = '/prefix' + ctx.request.path
  await next()
  ctx.response.data = JSON.parse(ctx.response.data)
})

// 实例中间件
prequest.use(async (ctx, next) => {
  ctx.request.path = '/prefix' + ctx.request.path
  await next()
  ctx.response.data = JSON.parse(ctx.response.data)
})
```

#### 中间件开发

PreQuest 在 koa 经典的洋葱中间件模型上，多设计了一个参数，来满足不同中间件传递数据的问题。以往我们在涉及到类似需求时，总会将数据挂到 ctx 对象上，但 ctx 本身又是库内部使用的一个对象，很容易造成 ctx 上的数据被覆盖，从而引发一些难以琢磨的 bug。

一个典型的中间件

```ts
async function middleware(ctx, next, opt) {
  ctx.request.path = '/prefix' + ctx.request.path

  // 中间件数据传递
  opt.count = (opt?.count || 0) + 1

  await next()

  ctx.response.data = JSON.parse(ctx.response.data)
}
```

您可以参阅 [错误重试](https://github.com/xdoer/PreQuest/blob/main/packages/error-retry/src/index.ts) 中间件
