# 包装器

一个可以赋予你定义的请求方法 PreQuest 能力的包装器。

## 简介

当我们基于 Fetch、XMLHttpRequest 和其他一些原生请求 API 定义一个请求方法，并在项目中大量使用。那么将其切换到 PreQuest 的代价是相对高昂的，这个项目可以很方便的、不侵入的将 PreQuest 的能力赋予到你的请求方法上。

## 安装

```bash
npm install @prequest/wrapper
```

## 使用

### 定义请求方法

```ts
function ajax(params) {
  const { path, method, baseURL, ...rest } = params

  // ...some code
}
```

### 包装器包装

```ts
import { wrapper } from '@prequest/wrapper'

const ajax = wrapper(function(params) {
  const { path, method, baseURL, ...rest } = params

  // some code
})
```

### Enjoy it

你可以像往常一样使用你的方法

```ts
ajax({ path: 'http://localhost:1000/api', method: 'get', params: { a: 'aaa' } })
```

使用 PreQuest 能力

```ts
ajax('http://localhost:1000/api', { method: 'get', params: { a: 'aaa' } })

ajax.get('http://localhost:1000/api', { params: { a: 'aaa' } })

ajax.use(async (ctx, next) => {
  console.log(ctx.request)
  await next()
  console.log(ctx.response)
})
```

创建实例

```ts
const instance = ajax.create({ baseURL: 'http://localhost:1000' })

instance.get('/api', { params: { a: 'aaa' } })

instance.use(async (ctx, next) => {
  console.log(ctx.request)
  await next()
  console.log(ctx.response)
})
```

全局配置

```ts
import { PreQuest } from '@prequest/wrapper'

PreQuest.defaults.baseURL = 'http://localhost:1000'

PreQuest.use(async (ctx, next) => {
  console.log(ctx.request)
  await next()
  console.log(ctx.response)
})
```

## 注意

你定义的方法必须满足几个条件。

### 只有一个参数

`wrapper` 的回调函数只支持一个参数，这意味着你只能传入一个对象。

```ts
// 不支持
function ajax(path, method, opt)

// 支持
function ajax({ path, method, opt })
```

### 混入参数

如果你通过别名的方式调用请求，PreQuest 会向你的参数中混入 `path` 和 `method` 参数。

```ts
// 混入 `{ path : http://localhost:1000/api }`
ajax('http://localhost:1000/api')

// 混入 `{ path : http://localhost:1000/api, method: post }`
ajax.post('http://localhost:1000/api')

// 混入 `{ path : /api, method: post }`
ajax.get('/api')
```
