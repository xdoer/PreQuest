# PreQuest

一个模块化可插拔的请求库。

## 简介

最近想写一个可以适配多平台的请求库，在做 xhr 和 fetch 的适配时发现二者的参数、响应、回调函数等差别很大。如果请求库想要抹平平台和环境差异，就需要统一的传参和响应类型，那么势必会在请求库内部做大量的判断，但这样也无法做到全平台全环境兼容，此外还会屏蔽掉底层 API 的特有的功能。

研究了 axios 和 umi-request 发现，上层请求库基本包含了拦截器、中间件和快捷请求等几个通用的，与请求过程基本无关的功能。

换个思路来想，既然实现一个统一全平台的请求库基本是不可能任务，那么是否可以有一个库可以很方便的为底层 API 赋予中间件、快捷请求等通用的功能，并且提供一个机制，让开发者可以接触和使用底层 API 的差异化功能？

PreQuest 就是这样一个项目。

PreQuest 中将发出请求的部分叫做请求过程 `adapter`, 这是一个与底层 API 接触交互的函数。无关请求的部分封装在了 `@prequest/core` 包中，它为 `adapter` 赋予了中间件和添加快捷请求入口的功能。通过中间件，可以很方便的对请求和响应进行拦截。

## 包

实现自己的请求库，需要对 `@prequest/core` 进行二次封装。

封装示例: [@prequest/adapter-fetch](./packages/adapter-fetch/src/index.ts)

使用示例: [example](./examples/web/src/Req.ts)

### @prequest/core

PreQuest 核心包。内置 koa 中间件模型，同时为请求方法添加快捷方式。负责对 `adapter` 请求前的参数和请求后的响应进行拦截和处理。

使用示例:

```ts
import { PreQuest } from '@prequest/core'

// adapter 实现具体的请求过程，opt 请求参数将在中间件中传递
const instance = PreQuest.createInstance<CustomRequest, CustomResponse>(adapter, opt)

// 中间件
instance.use(async (ctx, next) => {
  console.log(ctx.request)
  await next()
  console.log(ctx.response)
})

// 快捷请求
instance['get'|'post'|...](path, opt)
```

### @prequest/adapter-fetch

适配器。适配器中需要实现具体的请求过程。适配器参数和响应会通过中间件进行传递和处理。

示例:

```ts
function adapter(opt: CustomRequest) {
  const { url, ...options } = opt
  return fetch(url, options).json()
}
```

### @prequest/middleware-interceptor

拦截器。拦截器提供了类似 axios 的拦截器的功能。

```ts
import { InterceptorMiddleware } from '@prequest/middleware-interceptor'

const interceptor = new InterceptorMiddleware()

interceptor.request.use(
  (request) => {
    if(!request.path) throw New Error('Can not find path')
    request.path = '/prefix' + request.path
    return request
  },
  (e) => {
    console.log(e)  // Can not find path
  }
)

instance.use(interceptor.run)
```

### @prequest/helper

助手包。包中包含了请求过程中通用的一个辅助函数，比如拼接 URL，解析 Body，合并参数等

## TODO

- [] 加解密中间件
- [] 完善 xhr 和 fetch 适配器
- [] 添加 Node、小程序 适配器
- [] GraphQL 支持
