# @prequest/lock

## example

```ts
import { PreQuest } from '@prequest/core'
import { createLockWrapper } from '@prequest/lock'

const wrapper = createLockWrapper()

const instance = PreQuest.create(adapter)

instance.use(async (ctx, next) => {
  const token = await wrapper(getToken)
  ctx.request.headers['Authorization'] = `bearer ${token}`
  await next()
})

function getToken() {
  return PreQuest.create(adapter)('http://localhost:3000/token').then(res => res.data.token)
}
```

If the token is expired, how to clear token ?

```ts
import { createLockWrapper, Lock } from '@prequest/lock'

const lock = new Lock()
const wrapper = createLockWrapper(lock)

instance.use(async (ctx, next) => {
  const token = await wrapper(getToken)
  ctx.request.headers['Authorization'] = `bearer ${token}`
  await next()
})

function getData() {
  return instance.get('/api').catch(e => {
    if (e.statusCode === '401') {
      lock.value = null
      getData()
    }
  })
}
```
