# PreQuest

为你的请求库提供模块化可插拔的解决方案。

## 简介

最近想写一个可以适配多平台的请求库，在研究 xhr 和 fetch 发现二者的参数、响应、回调函数等差别很大。想到如果上层请求库想要抹平底层差异，需要统一的传参和响应格式，那么势必会在请求库内部做大量的判断，这样不但费时费力，还会屏蔽掉底层请求内核的特有功能。

研究 axios 和 umi-request 时发现，上层请求库其实基本都包含了拦截器、中间件和快捷请求等几个通用的，与具体请求过程无关的功能。然后通过暴露传参，可以让用户接触请求内核的差异化功能。比如在 axios 中，它的请求配置参数列表中，罗列了很多 [node 专属](https://axios-http.com/docs/req_config)的参数，那对于只需要在 web 环境中运行的 axios 来说，参数多少有些冗余，并且如果 axios 支持的平台越来越多(比如小程序、ReactNative)，那么参数冗余也将越来越大。

换个思路来想，既然实现一个适配多平台的统一的请求库有这些问题，那么是否可以从底向上的，提供一种方式可以很方便的为底层请求内核赋予上层请求库拦截器、中间件、快捷请求等几个通用功能，并且保留不同请求内核的差异化？

**PreQuest 就是这样一个项目。它可以基于不同的请求内核，提供一致的中间件、快捷请求、拦截器等功能的体验。**

## 设计原理

PreQuest 核心代码非常简单。它内置了经典的 koa 洋葱模型，并且为不同的请求方式提供了快捷入口，同时预留了一个底层内核的适配器接口，和适配器的配置入口。使用时，只需要传入一个适配器，就可以使用。

查看[Demo](#Example)

为了最小化的不侵入开发者请求库的个性化参数，PreQuest 没有内置诸如 baseURL, header 这样通用的配置项，但考虑到这些配置项大部分请求库都支持，因而 PreQuest 提供了 helper 包，来处理通用化配置项。此外需要注意的是，PreQuest 考虑到开发者可能有在中间件修改请求路径和方式的需求，所以将 **path** 和 **method** 两个字段混入到个性化配置中。示例参阅: [@prequest/fetch](./packages/fetch/src/index.ts)

中间件模型可以满足大部分的业务需求，比如: 请求头添加 token，输入日志，错误处理，加解密请求等等。PreQuest 项目也会提供一些解决方案，开发者只需要安装对应的包，并将其注入到中间件模型中即可使用。

## Example

```ts
import { PreQuest } from '@prequest/core'

// -----------------------------封装----------------------------------
function adapter(opt) {
  // path 与 method 由 PreQuest 注入
  const { path, method, baseURL, ...options } = opt
  const url = baseURL + path
  return fetch(url, { ...options, method }).then((res) => res.json())
}

function createRequest(opt) {
  return PreQuest.createInstance(adapter, opt)
}

// -----------------------------使用----------------------------------

// 自定义配置项
const opt = { baseURL: 'http://localhost:3000' }

const prequest = createRequest(opt)

// 中间件
prequest.use(async (ctx, next) => {
  // ctx.request 为传入的 opt
  console.log(ctx.request)

  await next()

  // ctx.response 为 adapter 的响应内容
  console.log(ctx.response)
})

// 调用
prequest.post('/api', { data: { a: 1 } })
```

## TODO

- [x] 全局中间件
- [x] 全局配置
- [ ] 完善 xhr 和 fetch 适配器
- [ ] 添加 Node、小程序 适配器
- [ ] GraphQL 支持
