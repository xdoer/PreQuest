<div align=center>
<img src="logo.png" width="100%" height="100%" />
</div>

# PreQuest

为你的 Http 请求提供模块化可插拔的解决方案。

[![npm](https://img.shields.io/npm/v/@prequest/core.svg)](https://www.npmjs.com/package/@prequest/core)
[![Minzipped size](https://img.shields.io/bundlephobia/minzip/@prequest/core.svg)](https://bundlephobia.com/result?p=@prequest/core)
[![NPM Downloads](https://img.shields.io/npm/dm/@prequest/core.svg?style=flat)](https://www.npmjs.com/package/@prequest/core)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

[English](./README.md) | 中文

## 简介

如果你使用类似 axios、umi-request 或者其他请求库，或许你不需要这个。但如果你使用原生的请求 API(XMLHttpRequest、fetch、node http.request 或者 小程序，快应用原生请求)。这个库可以很方便的为这些原生请求 API 添加中间件、拦截器、全局配置、别名请求等等特性。

## 示例

```ts
import { PreQuest } from '@prequest/core'

/**
 * 你只需要实现一个基于原生 API 的适配器
 * 这里基于你的实际需求，定义 opt 参数，但注意只能是一个对象。
 * 使用未指定参数的请求方式 `eg:prequest.post('/api')`, PreQuest 会向你的参数中混入`path` 和 `method` 参数。
 * */
const adapter = opt => {
  const { path, baseURL, ...rest } = opt
  return fetch(baseURL + path, rest).then(res => res.json())
}

// 创建一个实例
const prequest = PreQuest.create(adapter, { baseURL: 'http://localhost:3000' })

// 进行 http 调用
prequest.request('/api', { method: 'get' })
prequest.request({ path: '/api', method: 'get' })

// prequest 是 prequest.request 的别名
prequest('/api', { method: 'get' })
prequest({ path: '/api', method: 'get' })

// 用别名请求
prequest.get('/api')

// 实例中间件
let token = ''
prequest.use(async (ctx, next) => {
  if (!token) {
    // 请求暂停
    prequest.lock()

    token = await PreQuest.create(adapter).get('/token')

    // 恢复请求
    prequest.unlock()
  }

  ctx.request.headers['token'] = token

  await next()
})

// 全局请求的配置项
PreQuest.defaults.baseURL = 'http://localhost:3000'

// 全局中间件
PreQuest.use(async (ctx, next) => {})
```

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
