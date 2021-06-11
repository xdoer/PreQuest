# 核心

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
import { prequest, PreQuest } from 'myHttp'

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
  method: 'get',
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

定义请求和响应参数类型，以便用户在使用时，可以获得智能提示。

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

接着，进行 `adapter` 函数实现

```ts
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
const prequest = PreQuest.create<Request, Response>(adapter, opt)
```

### 执行请求

接着，就可以用这个实例进行 HTTP 请求。

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

### 全局配置

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
