import InterceptorMiddleware from '../src'

const interceptorMiddleware = new InterceptorMiddleware<any, any>()

test('InterceptorMiddleware', async () => {
  const ctx: any = { request: { method: 'GET' }, response: {} }

  interceptorMiddleware.request.use(opt => {
    expect(opt).toMatchObject(ctx.request)
  })

  interceptorMiddleware.response.use(opt => {
    expect(opt).toEqual(1)
  })

  await interceptorMiddleware.run(ctx, () => {
    ctx.response = 1
    return Promise.resolve()
  })
})
