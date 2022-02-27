import { PreQuest } from '../src'

declare module '@prequest/types' {
  interface PQRequest {
    baseURL: string
  }
}

const prequest = PreQuest.create(() => Promise.resolve(1), {
  baseURL: 'http://localhost:3000',
})

test('prequest', async () => {
  expect(await prequest('/')).toBe(1)
})

test('prequest.method', async () => {
  expect(await prequest.request({ path: '/' })).toBe(1)
  expect(await prequest.get('/')).toBe(1)
  expect(await prequest.post('/')).toBe(1)
  expect(await prequest.delete('/')).toBe(1)
  expect(await prequest.put('/')).toBe(1)
  expect(await prequest.options('/')).toBe(1)
  expect(await prequest.head('/')).toBe(1)
  expect(await prequest.patch('/')).toBe(1)
  expect(await prequest('/', { method: 'RPC' })).toBe(1)
})

test('middleware', async () => {
  // global middleware
  PreQuest.use(async (ctx, next) => {
    await next()

    ctx.response = 3
  })

  expect(await prequest('/')).toBe(3)

  // instance middleware
  prequest.use(async (ctx, next) => {
    expect(ctx).toMatchObject({ request: { baseURL: 'http://localhost:3000' }, response: {} })

    await next()

    ctx.response = 2
  })

  // 全局中间件最先注册，所以最先处理请求参数、最晚处理响应结果
  expect(await prequest.post('/api')).toBe(3)
})
