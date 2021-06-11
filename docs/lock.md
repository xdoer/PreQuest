# 请求锁

请求锁提供了一种方案，用来处理 token 刷新、登录校验的场景

## 安装

```bash
npm install @prequest/lock
```

## 使用

```ts
import { prequest, create } from '@prequest/xhr'
import { createLockWrapper, Lock } from '@prequest/lock'

const lock = new Lock()
const wrapper = createLockWrapper(lock)

prequest.use(async (ctx, next) => {
  const token = await wrapper(getToken)
  ctx.request.headers['Authorization'] = `bearer ${token}`
  await next()
})

function getData() {
  return prequest.get('/api').catch(e => {
    if (e.statusCode === '401') {
      lock.value = null
      getData()
    }
  })
}
```

与错误重试中间件一起使用、进行无痕刷新 token

```ts
import { prequest, create } from '@prequest/xhr'
import { createLockWrapper, Lock } from '@prequest/lock'
import { ErrorRetryMiddleware } from '@prequest/error-retry'

// 错误重新中间件需要最先注册
const errorRetryMiddleware = new ErrorRetryMiddleware({
  retryControl(opt, e) {
    if ((e.message = 'token is expired')) {
      return true
    }
  },
})
prequest.use(errorRetryMiddleware.run)

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

// 认证失败、错误重试
prequest.use(async (ctx, next) => {
  await next()
  if (ctx.response.statusCode === '401') {
    lock.setValue(null)
    throw new Error('token is expired')
  }
})
```

**_注意: 这里要注意中间件执行顺序_**
