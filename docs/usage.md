# 使用

## 开箱即用

项目针对不同的平台提供了不同的安装包，这样既减小了安装包体积，又避免了参数的冗余。

> - [@prequest/xhr](/xhr ':target=_self'): 一个基于 XMLHttpRequest 的请求库
> - [@prequest/fetch](/fetch ':target=_self'): 一个基于 Fetch API 的请求库
> - [@prequest/node](/node ':target=_self'): 一个 nodejs 端的请求库
> - [@prequest/miniprogram](/miniprogram ':target=_self'): 一个小程序端的请求库
> - [@prequest/miniprogram-addon](/miniprogram-addon ':target=_self'): 小程序端的上传下载包

下面以 `@prequest/xhr` 为例，介绍基于 `@prequest/core` 的请求库，具有以下通用的能力:

### 全局配置

`PreQuest.defaults` 默认值为一个空对象

```ts
import { PreQuest } from '@prequest/xhr'

PreQuest.defaults.baseURL = 'http://locahost:8080'
```

### 创建实例

一般来讲，请求库会默认导出一个名为 `prequest` 的请求实例，此外你可以通过 `create` 方法创建更多的实例。

```ts
import { create, prequest } from '@prequest/xhr'

const prequest2 = create()

// 你可以初始化默认参数
const prequest3 = create({
  baseURL: 'http://localhost:8080',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
```

在类小程序的请求库中，稍有些区别，为了满足兼容不同的类小程序平台，创建实例的时候，需要将原生请求方法传入。

```ts
import { create } from '@prequest/miniprogram'

// 在微信小程序中使用，传入 wx.request
const prequest2 = create(wx.request)

// 在支付宝小程序中使用，传入 my.request
const prequest2 = create(my.request)

// 在百度小程序中使用，传入 swan.request
const prequest2 = create(swan.request)

// 其他小程序平台类似，只需传入对应的实例方法即可

// 同样可以初始化默认参数
const prequest3 = create(wx.request, {
  baseURL: 'http://localhost:8080',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
```

在 Taro、Uni 等小程序框架中，使用方式一致

```ts
import { create } from '@prequest/miniprogram'
import Taro from '@tarojs/taro'

const prequest = create(Taro.request)
```

快应用、华为鸿蒙等采用了类似小程序的请求方式，使用时将原生请求方法传入即可

```ts
import { create } from '@prequest/miniprogram'
import fetch from '@system.fetch'

const prequest2 = create(fetch.fetch)
```

### 发起请求

```ts
import { prequest, create } from '@prequest/xhr'

// 基本请求方法
prequest.request('/api', { data: { a: 1 } })

// 基本请求方法的 alias
prequest('/api', { data: { a: 1 } })

// 带 HTTP 请求方法的请求
prequest.get('/api', { data: { a: 1 } })
```

全部调用方式为:

```text
prequest(config)

prequest(path[, config])

prequest#[request|get|post|delete|put|patch|head|options](path[, config])
```

?> PreQuest 会将 `PreQuest.defaults = config`、`create(config)` 与 `prequest(config)` 这三部分的 config 参数进行整合，经过中间件后，最终传入到请求内核中。

!> 发起请求，没有显式指定请求路径和 HTTP 请求方法，会自动混入 `path` 和 `method` 参数。 eg: `prequest.get('/api')`，请求内核得到的参数为 `{ path: '/api', method: 'GET' }`，之后请求内核会将 `path` 与 `baseURL` 和 `params` 三者整合成 `url`，用以发起请求。

下面演示 `path`、`baseURL` 与 `url` 参数的区别，demo 中的请求都是等价的

```ts
prequest('http://localhost:3000/audio/123')

prequest('/audio/123', { baseURL: 'http://localhost:3000' })

prequest({ path: 'http://localhost:3000/audio/123' })

prequest({ path: '/audio/123', baseURL: 'http://localhost:3000' })

prequest({ url: 'http://localhost:3000/audio/123' })
```

### 中间件

中间件分为全局中间件与实例中间件。全局中间件将作用于所有的请求实例上，实例中间件作用于由请求库导出的 `create` 方法创建的实例上。

#### 全局中间件

```ts
import { PreQuest, Request, Response } from '@prequest/xhr'

PreQuest.use<Request, Response>(async (ctx, next) => {
  console.log(ctx.request)

  await next()

  console.log(ctx.response)
})
```

#### 实例中间件

```ts
import { create } from '@prequest/xhr'

const prequest = create()

prequest.use(async (ctx, next) => {
  console.log(ctx.request)

  await next()

  console.log(ctx.response)
})
```

#### ctx 数据类型

| 名称     | 类型     | 含义                                  |
| -------- | -------- | ------------------------------------- |
| request  | Request  | 请求参数，数据类型一般会由请求库导出  |
| response | Response | 响应类型， 数据类型一般会由请求库导出 |
| context  | PreQuest | PreQuest 实例对象                     |

## 应用扩展

项目中针对业务中常见的场景，提供了便捷的解决方案。可以搭配上一节中的请求库一同使用。

> - [@prequest/cache](/cache ':target=_self'): 接口缓存中间件
> - [@prequest/timeout](/timeout ':target=_self'): 超时中间件
> - [@prequest/error-retry](/error-retry ':target=_self'): 接口请求错误重试中间件
> - [@prequest/interceptor](/interceptor ':target=_self'): 拦截器中间件
> - [@prequest/lock](/lock ':target=_self'): 请求锁，token 处理的解决的方案
> - [@prequest/use-request](/use-request ':target=_self'): React 请求 Hook
> - [@prequest/uploader](/uploader ':target=_self'): 文件上传
> - [@prequest/cancel-token](/cancel-token ':target=_self'): 取消请求解决方案

## 项目迁移

> - [@prequest/wrapper](/wrapper ':target=_self'): 一个包裹器
> - [集成 axios](/work-with-axios ':target=_self'): 与 axios 一起工作

## 定制化

> - [@prequest/core](/core ':target=_self'): PreQuest 核心能力
> - [@prequest/cancel-token](/cancel-token ':target=_self'): 取消请求解决方案
> - [@prequest/helper](https://github.com/xdoer/PreQuest/tree/main/packages/helper ':target=_blank'): 一些有用的参数处理、响应处理的工具包
> - [@prequest/utils](https://github.com/xdoer/PreQuest/tree/main/packages/utils ':target=_blank'): 常规函数工具包
