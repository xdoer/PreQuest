# @prequest/timeout

超时中间件。对于不支持设置超时时间的请求内核，你可以安装超时中间件来获得超时响应失败的能力。

> 对于一些本不支持设置超时时间的请求内核以及 Fetch 来说，没有办法真正的在超时之后，取消请求。只能使用超时抛异常的方式来满足需求。

## 安装

```bash
npm install @prequest/timeout
```

## 使用

### 创建实例

```ts
import { create } from '@prequest/xhr'
import timeoutMiddleware from '@prequest/timeout'

const prequest = create()
```

### 统一控制

```ts
import { prequest } from '@prequest/xhr'
import timeoutMiddleware from '@prequest/timeout'

const middleware = timeoutMiddleware({
  timeout: 5000,
  timeoutControl: () => {
    // 开发环境设置超时时间
    return process.NODE_ENV === 'development'
  },
})

prequest.use(middleware)
```

### 单一控制

```ts
prequest('/api', {
  timeout: 1000,
})
```

## 配置项

| Option Name    | Type                      | Default | Required | Meaning  |
| -------------- | ------------------------- | ------- | -------- | -------- |
| timeout        | number                    | 0       | false    | 超时时间 |
| timeoutControl | (opt: Request) => boolean | null    | false    | 超时控制 |

一般来讲，不会用到 `timeoutControl` 这个方法，但对于一些跨平台应用来说，打包成不同的平台，可能会使用不同的请求内核，而这些内核对于 timeout 支持度是不一样的，因而希望，如果请求内核支持 timeout,那么 timeout 由内核进行处理，否则由中间件处理。

下面以 uni-app 为例：

查看 uni.request [文档](https://uniapp.dcloud.io/api/request/request)，发现微信小程序与支付宝小程序支持 timeout，其他环境不支持，因而可以写如下控制条件

```ts
// 获取编译的平台信息
const platform = process.env.UNI_PLATFORM

const middleware = timeoutMiddleware({
  timeout: 5000,
  timeoutControl(opt) {
    // 微信小程序、支付宝小程序 timeout 由请求内核进行处理
    if (['mp-alipay', 'mp-weixin'].includes(platform)) return false

    // 其余由中间件处理
    return true
  },
})
```
