# 错误重试

错误重试中间件

## 安装

```bash
npm install @prequest/error-retry
```

## 使用

```ts
import { prequest, Request, Response } from '@prequest/xhr'
import { ErrorRetryMiddleware } from '@prequest/error-retry'
import { isCancel } from '@prequest/cancel-token'

const errorRetryMiddleware = new ErrorRetryMiddleware<Request, Response>({
  // 错误重试次数
  retryCount: 2,

  // opt 为 Request 类型，通过该函数，你可以控制那些接口需要错误重试
  retryControl(opt, e) {
    const { method, path } = opt

    // 手动取消的请求不进行错误重试
    if (isCancel(e)) return false

    // api 路径不进行错误重试
    if (path === '/api') return false

    // 只有 get 方法才进行错误重试
    return method === 'get'
  },
})

prequest.use(errorRetryMiddleware.run)
```

## 配置项

| Option Name  | Type                                   | Default                                   | Required | Meaning                               |
| ------------ | -------------------------------------- | ----------------------------------------- | -------- | ------------------------------------- |
| retryCount   | number                                 | 1                                         | false    | 错误重试次数                          |
| retryControl | (opt: RequestOpt, e: Error) => boolean | (opt: RequestOpt) => opt.method === 'get' | false    | 重试策略，默认 get 请求会进行错误重试 |
