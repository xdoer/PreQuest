# PreQuest

为你的请求库提供模块化可插拔的解决方案。

## 简介

最近想写一个可以适配多平台的请求库，在研究 xhr 和 fetch 发现二者的参数、响应、回调函数等差别很大。想到如果上层请求库想要抹平底层差异，需要统一的传参和响应格式，那么势必会在请求库内部做大量的判断，这样不但费时费力，还会屏蔽掉底层请求内核的特有功能。

研究 axios 和 umi-request 时发现，上层请求库其实基本都包含了拦截器、中间件和快捷请求等几个通用的，与具体请求过程无关的功能。然后通过传参，让用户接触底层请求内核。问题在于，不同的底层内核，支持的参数是不一样的，上层库可能做一些处理，抹平一些参数的差异化，但对于底层内核的特有的功能，要么放弃，要么在参数列表中加入一些具体内核的特有的参数。比如在 axios 中，它的请求配置参数列表中，罗列了很多 [node 专属](https://axios-http.com/docs/req_config)的参数，那对于只需要在 web 环境中运行的 axios 来说，参数多少有些冗余，并且如果 axios 要支持其他请求内核(比如小程序)，那么参数冗余也将越来越大，扩展性也差。

换个思路来想，既然实现一个适配多平台的统一的请求库有这些问题，那么是否可以从底向上的，针对不同的请求内核，提供一种方式可以很方便的为其赋予上层请求库拦截器、中间件、快捷请求等几个通用功能，并且保留不同请求内核的差异化？

**PreQuest 就是这样一个项目。它可以基于不同的请求内核，提供一致的中间件、快捷请求、拦截器等功能的体验。**

## 设计原理

PreQuest 核心代码非常简单。它内置了经典的 koa 洋葱模型，并且为不同的请求方式提供了快捷入口，同时预留了一个底层内核的适配器接口，和适配器的配置入口。使用时，只需要传入一个适配器，就可以使用。

查看[Demo](#Example)

为了最小化的不侵入开发者请求库的配置参数，PreQuest 没有内置诸如 baseURL, header 这样通用的配置项，但考虑到这些配置项大部分请求库都支持，因而 PreQuest 提供了 helper 包，来处理通用化配置。此外需要注意的是，PreQuest 考虑到开发者可能有在中间件修改请求路径和方式的需求，所以将由快捷请求`eg:request.get('/api')`产生的 **path** 和 **method** 两个字段混入到配置参数中。

中间件模型可以满足大部分的业务需求，比如: 请求头添加 token，输入日志，错误处理，加解密请求等等。PreQuest 项目也会提供一些解决方案，开发者只需要安装对应的包，并将其注入到中间件模型中即可使用。

## Example

以适配微信小程序平台为例。

### 小程序请求库

首先看一下小程序平台请求 Demo。可以看到功能比较简陋，当你想做一些登录添加 Token，错误处理等功能，还要花一些时间去考虑和处理。

```ts
wx.request({
  url: 'test.php',
  data: {
    x: '',
    y: '',
  },
  header: {
    'content-type': 'application/json',
  },
  success(res) {
    console.log(res.data)
  },
})
```

使用 PreQuest 进行封装

```ts
import { PreQuest } from '@prequest/core'

function adapter(opt) {
  // 这里的 path 与 method 由 PreQuest 注入，也可以由用户传入覆盖
  const { path, method, baseURL, ...options } = opt
  const url = baseURL + path
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      url,
      method,
      success: resolve,
      fail: reject,
    })
  })
}

function createPreQuest(opt) {
  return PreQuest.createInstance(adapter, opt)
}
```

使用

```ts
// 全局配置项
PreQuest.defaults.baseURL = 'http://localhost:3000'

// 实例配置项
const opt = { baseURL: 'http://localhost:3001' }
const prequest = createPreQuest(opt)

// 中间件
prequest.use(async (ctx, next) => {
  console.log(ctx.request) // 修改请求参数
  await next()
  console.log(ctx.response) // 拦截修改响应
})

// 调用
prequest.request({ path: '/api', method: 'post', data: { a: 1 } })
prequest.post('/api', { data: { a: 1 } })
```

实际上，如果 wx.request 方法由用户端传入的话，那么这个请求库可以适配绝大部分小程序框架，和一些类小程序框架(快应用)。详情请查阅[@prequest/miniprogram](./packages/miniprogram/src/index.ts)

### 拦截器

拦截器是处理请求前参数和请求后的响应数据的一个工具。其实中间件模型也可以处理这样的功能，但为了方便习惯使用 axios 的用户，PreQuest 也提供了拦截器功能。

封装

```ts
import { PreQuest } from '@prequest/core'
import { InterceptorMiddleware } from '@prequest/interceptor'

function adapter(opt) {
  // ...some code
}

// 全局拦截器注册
const interceptor = new InterceptorMiddleware()
PreQuest.use(interceptor.run)
PreQuest.interceptor = interceptor

export function createPreQuest(opt) {
  const instance = PreQuest.createInstance(adapter, opt)
  // 实例拦截器
  const interceptor = new InterceptorMiddleware()
  instance.use(interceptor.run)
  instance.interceptor = interceptor

  return instance
}
```

使用

```ts
const instance = createPreQuest()
instance.interceptor.request.use(
  opt => modify(opt),
  e => handle(e)
)
```

### GraphQL

GraphQL 请求实则是一个 http post 请求的语法糖

```ts
import { createPreQuest } from '@prequest/fetch'

const query = `
  {
    me {
      name
    }
  }
`
// 传入一个 PreQuest 的实例
const request = graphql(createPreQuest({ path: '/graphql' }))

request(query, { name: 'prequest' }).then(res => console.log(res))
```

## TODO

- [x] 全局中间件
- [x] 全局配置
- [x] GraphQL 支持
- [x] 小程序 适配器（支持各平台小程序、支持快应用）
- [x] 完善 fetch 适配器
- [ ] 完善 xhr 适配器
- [ ] 添加 Node 端适配器
