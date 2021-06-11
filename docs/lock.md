# 请求锁

请求锁提供了一种方案，用来处理 token 刷新、登录校验的场景

## 安装

```bash
npm install @prequest/lock
```

## 使用

与错误重试中间件一起使用、进行无痕刷新 token

首先，为请求添加 token 校验

```ts
import { prequest } from '@prequest/xhr'
import { createLockWrapper, Lock } from '@prequest/lock'

const lock = new Lock({
  getValue() {
    return localStorage.getItem('token')
  },
  setValue(token) {
    localStorage.setItem('token', token)
  },
})
const wrapper = createLockWrapper(lock)

// 添加 token
prequest.use(async (ctx, next) => {
  const token = await wrapper(getToken)
  ctx.request.headers['Authorization'] = `bearer ${token}`
  await next()
})
```

接着，添加错误重试机制

```ts
import { prequest, create } from '@prequest/xhr'
import { createLockWrapper, Lock } from '@prequest/lock'
import { ErrorRetryMiddleware } from '@prequest/error-retry'

const errorRetryMiddleware = new ErrorRetryMiddleware({
  retryControl(opt, e) {
    // 捕获到抛出的 token 失效异常，则进行错误重试
    if ((e.message = 'token is expired')) {
      // 清除 token 值，会重新请求 token 接口，获取最新 token 值
      lock.setValue(null)
      return true
    }
  },
})
// 注意，错误重试中间件要注册位置要先于抛出异常的中间件
prequest.use(errorRetryMiddleware.run)

// 认证失败、错误重试
prequest.use(async (ctx, next) => {
  await next()
  if (ctx.response.statusCode === '401') {
    throw new Error('token is expired')
  }
})
```

## 配置项

### Lock 配置项

| Option Name | Type                          | Default | Required | Meaning |
| ----------- | ----------------------------- | ------- | -------- | ------- |
| getValue    | () => Promise\<any\>          |         | false    | 获取值  |
| setValue    | (opt: any) => Promise\<void\> |         | false    | 存储值  |
