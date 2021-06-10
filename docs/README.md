<div align=center>
<img src="https://raw.githubusercontent.com/xdoer/PreQuest/main/logo.png" width="100%" height="100%" />
</div>

# PreQuest

一个模块化，可插拔的请求库。

[![npm](https://img.shields.io/npm/v/@prequest/core.svg)](https://www.npmjs.com/package/@prequest/core)
[![Minzipped size](https://img.shields.io/bundlephobia/minzip/@prequest/core.svg)](https://bundlephobia.com/result?p=@prequest/core)
[![NPM Downloads](https://img.shields.io/npm/dm/@prequest/core.svg?style=flat)](https://www.npmjs.com/package/@prequest/core)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## 简介

PreQuest 采用了请求内核与上层封装相分离的模式，针对不同的环境，提供了一致的中间件、拦截器、全局配置、别名请求等功能。你可以基于本项目，做请求库的二次封装，或者直接使用仓库中针对不同平台，封装好的请求库。本项目中，针对一些常用功能，提供了插件化的配置，你可以针对你的应用场景，进行安装与应用。

## 使用示例

### Adapter

首先你需要定义一个 adapter 函数，这是一个包含原生 Http 请求的方法。

```ts
function ajax(params) {
  const { path, method, baseURL, headers, ...other } = params

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // ...
  })
}
```

上面的 ajax 实际就是一个 adapter 函数，函数只支持传入一个对象，返回一个 promise.

**_注意: 本项目中已针对不同的平台，提供了不同的包_**

### 创建实例

使用 `PreQuest.create` 创建实例。

```ts
import { PreQuest } from '@prequest/core'

const prequest = PreQuest.create(ajax, { baseURL: 'http://localhost:3000' })
```

### 执行请求

直接请求

```ts
prequest('/api')
prequest({ path: '/api', method: 'get' })
```

别名请求

```ts
prequest.request('/api', { method: 'get' })
prequest.request({ path: '/api', method: 'get' })

// 'get', 'post', 'delete', 'put', 'patch', 'head', 'options'
prequest.get('/api')
prequest.post('/api')
prequest.delete('/api')
prequest.put('/api')
prequest.patch('/api')
prequest.head('/api')
prequest.options('/api')
```

### 中间件

PreQuest 支持实例中间件和全局中间件。

实例中间件

```ts
prequest.use(async (ctx, next) => {
  ctx.request.path = `/prefix` + ctx.request.path
  await next()
  ctx.response.body = JSON.parse(ctx.response.body)
})
```

全局中间件

```ts
PreQuest.use(async (ctx, next) => {
  console.log(ctx.request)
  await next()
  console.log(ctx.response)
})
```

### 配置项

全局配置项

```ts
PreQuest.defaults.baseURL = 'http://localhost:3000'
```

实例配置项

```ts
const prequest = PreQuest.create(ajax, { timeout: 5000 })
```

请求配置项

```ts
prequest('/api', { withCredentials: false })
```

PerQuest 会合并三个地方的配置项，经过中间件处理，最终注入到 adapter 函数中。以上示例中，PreQuest 会将 `{ baseURL: 'http://localhost:3000', timeout: 5000, path: '/api', withCredentials: false }` 注入到 adapter 函数。

PreQuest 本身不参与任何参数的处理，所有配置的参数，需要开发者在中间件和 adapter 函数中进行接收和处理。

## 更多

查询下列文档，获取更多信息

### @prequest/core

PreQuest 的核心能力。 内置 中间件， 别名请求，全局配置等功能。

文档: [@prequest/core](https://github.com/xdoer/PreQuest/blob/main/packages/core/README.md).

### @prequest/wrapper

在基本不侵入你项目中现有的请求方法的前提下，赋予 ProQuest 的能力。

文档: [@prequest/wrapper](https://github.com/xdoer/PreQuest/blob/main/packages/wrapper/README.md).

### @prequest/interceptor

PreQuest 拦截器。可以让你获得类似 axios 中的拦截器的体验。

文档: [@prequest/interceptor](https://github.com/xdoer/PreQuest/blob/main/packages/interceptor/README.md).

### @prequest/graphql

Http Post 请求的语法糖。需配合一个 PreQuest 的实例使用。

文档: [@prequest/graphql](https://github.com/xdoer/PreQuest/blob/main/packages/graphql/README.md)

### @prequest/helper

编写请求库的帮助函数。可以很方便的为请求库提供一些通用配置项。

文档: [@prequest/helper](https://github.com/xdoer/PreQuest/blob/main/packages/helper/README.md)

### 请求库

几个基于 PreQuest 的请求库。

> - [@prequest/xhr](https://github.com/xdoer/PreQuest/blob/main/packages/xhr/README.md). 基于 XMLHttpRequest 的请求库.
> - [@prequest/fetch](https://github.com/xdoer/PreQuest/blob/main/packages/fetch/README.md). 基于 Fetch 的请求库
> - [@prequest/miniprogram](https://github.com/xdoer/PreQuest/blob/main/packages/miniprogram/README.md). 为小程序，快应用定制的请求库。

## Development

- [Contributing Guide](/CONTRIBUTING.md)

## License

[MIT License](https://github.com/xdoer/PreQuest/blob/main/LICENSE)
