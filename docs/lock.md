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
