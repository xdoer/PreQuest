import { create, PreQuest } from '@prequest/node'
import Lock from '../src'

test('Lock', async () => {
  let setTokenCount = 0

  const map = new Map()

  let token = ''

  const lock = new Lock({
    getValue() {
      return map.get(token)
    },
    setValue(value) {
      setTokenCount = setTokenCount + 1
      map.set(token, value)
    },
    clearValue() {
      map.delete(token)
    },
  })

  const wrapper = Lock.createLockWrapper(lock)

  PreQuest.defaults.baseURL = 'http://localhost:8080'

  const prequest = create<{ skipToken: boolean }, {}>()

  prequest.use(async (ctx, next) => {
    if (ctx.request.skipToken) return next()
    const token = await wrapper(() =>
      prequest('/token', { skipToken: true }).then(res => {
        return res.data
      })
    )
    ctx.request.headers = ctx.request.headers || {}
    ctx.request.headers['Auth'] = token
    await next()
  })

  await Promise.all([
    prequest('/api'),
    prequest('/api'),
    prequest('/api'),
    prequest('/api'),
    prequest('/api'),
    prequest('/api'),
  ])
  expect(setTokenCount).toEqual(1)
})
