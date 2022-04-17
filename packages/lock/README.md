# @prequest/lock

请求锁提供了一种方案，用来处理 token 刷新、登录校验的场景。

## 安装

```bash
npm install @prequest/lock
```

## 使用

与错误重试中间件一起使用、进行 token 失效刷新或重新登录

首先，为请求添加 token 校验

```ts
import { prequest, create } from '@prequest/xhr'
import Lock from '@prequest/lock'

const lock = new Lock({
  getValue() {
    return localStorage.getItem('token')
  },
  setValue(token) {
    localStorage.setItem('token', token)
  },
  clearValue() {
    localStorage.removeItem('token')
  },
})
const wrapper = Lock.createLockWrapper(lock)

// 添加 token
prequest.use(async (ctx, next) => {
  const token = await wrapper(getToken)
  ctx.request.headers = ctx.request.headers || {}
  ctx.request.headers['Authorization'] = `bearer ${token}`
  await next()
})

// 创建一个获取 token、不走中间件的实例
const tokenRequest = create()

function getToken() {
  return tokenRequest('http://localhost:3000/token').then(res => res.data.token)
}
```

或者，你不想创建新的请求 Token 实例的话，你可以设计传参，跳过添加 token 的步骤

```ts
import Lock from '@prequest/lock'
import { prequest, create } from '@prequest/xhr'

const lock = new Lock({ ... })

const wrapper = Lock.createLockWrapper(lock)

// 添加 token
prequest.use(async (ctx, next) => {
  if (ctx.request.skipTokenCheck) return next()

  const token = await wrapper(getToken)
  ctx.request.headers = ctx.request.headers || {}
  ctx.request.headers['Authorization'] = `bearer ${token}`
  await next()
})

function getToken() {
  // 传参跳过 token 添加
  return prequest('/token', { skipTokenCheck: true })
}
```

接着，添加错误重试机制

```ts
import { prequest, create } from '@prequest/xhr'
import ErrorRetryMiddleware from '@prequest/error-retry'

const errorRetryMiddleware = ErrorRetryMiddleware({
  retryCount: 2,
  retryControl(opt, e) {
    // 捕获到抛出的 token 失效异常，则进行错误重试
    if ((e.message = 'token is expired')) {
      // 清除 token 值，会重新请求 token 接口，获取最新 token 值
      lock.clear()

      // 进行错误重试
      return true

      // 或者直接重定向到登录页
      location.href = '/login'
      return false
    }
  },
})
// 注意，错误重试中间件要注册位置要先于抛出异常的中间件
prequest.use(errorRetryMiddleware)

// 认证失败、错误重试
prequest.use(async (ctx, next) => {
  await next()
  if (ctx.response.statusCode === '401') {
    throw new Error('token is expired')
  }
})
```

## 配置项

| Option Name | Type                          | Default | Required | Meaning |
| ----------- | ----------------------------- | ------- | -------- | ------- |
| getValue    | () => Promise\<any\>          |         | true     | 获取值  |
| setValue    | (opt: any) => Promise\<void\> |         | true     | 存储值  |
| clearValue  | () => Promise\<void\>         |         | true     | 清除值  |

有些平台获取 storage 的方式是异步的，因而这里设计成了异步调用
