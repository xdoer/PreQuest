import CacheMiddleware from '../src'

const cacheStore = new Map()
const cacheKernel = () => cacheStore

const cacheMiddleware = CacheMiddleware<any, any>({
  enable: true,

  // 5s 之后，缓存失效
  ttl: 5000,

  // 缓存 ID, 默认直接 JSON.stringify 序列化 opt。你可以通过此函数，判断哪些请求是相同请求。
  requestId(opt) {
    const { path, method } = opt
    return `${method}-${path}`
  },

  // 缓存内核，默认使用 Map 数据结构存到内存。你可以通过此函数，自定义数据存储方式。
  cacheKernel,

  // 控制可缓存
  cacheControl(req) {
    return req.method === 'GET'
  },
})

test('CacheMiddleware', async () => {
  // 初始化 ctx
  const ctx: any = { request: { method: 'GET', path: '/api' }, response: {} }

  await cacheMiddleware(ctx, (() => {}) as any)

  expect(cacheStore.get('GET-/api')).toMatchObject({ ctx })

  // POST 方法接口不缓存
  ctx.request.method = 'POST'
  ctx.request.path = '/api2'
  await cacheMiddleware(ctx, (() => {}) as any)

  expect(cacheStore.get('POST-/api2')).toBeUndefined()
})
