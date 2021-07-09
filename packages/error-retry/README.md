# @prequest/error-retry

错误重试中间件

## 安装

```bash
npm install @prequest/error-retry
```

## 使用

### 类型注入

类型注入需要创建实例，通过类型注入，可以在写代码时，获得智能提示。

```ts
import { create, Request, Response } from '@prequest/xhr'
import errorRetryMiddleware, { ErrorRetryInject } from '@prequest/error-retry'

const prequest = create<ErrorRetryInject>()
```

### 统一控制

```ts
import { prequest, Request, Response } from '@prequest/xhr'
import errorRetryMiddleware from '@prequest/error-retry'

prequest.use(
  errorRetryMiddleware<Request, Response>({
    // 错误重试次数
    retryCount: 2,

    // opt 为 Request 类型，通过该函数，你可以控制那些接口需要错误重试
    retryControl(opt, e) {
      const { method, path } = opt

      // 如果是具体某个错误，则不进行重试
      if (e.message === 'internal error') return false

      // api 路径不进行错误重试
      if (path === '/api') return false

      // 只有 get 方法才进行错误重试
      return method === 'GET'
    },
  })
)
```

### 单一控制

注册错误重试中间件后，每一个请求也可以单独配置错误请求次数、和错误请求控制

```ts
prequest('/api', {
  errorRetry: 1,
  retryControl(_, e) {
    if (e.message === '测试') {
      return false
    }
  },
})
```

## 配置项

| Option Name  | Type                                   | Default                                   | Required | Meaning                               |
| ------------ | -------------------------------------- | ----------------------------------------- | -------- | ------------------------------------- |
| retryCount   | number                                 | 1                                         | false    | 错误重试次数                          |
| retryControl | (opt: RequestOpt, e: Error) => boolean | (opt: RequestOpt) => opt.method === 'GET' | false    | 重试策略，默认 get 请求会进行错误重试 |
