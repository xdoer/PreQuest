import InterceptorMiddleware from '../src'

const interceptorMiddleware = new InterceptorMiddleware()

test('InterceptorMiddleware', async () => {
  const ctx: any = { request: { method: 'GET' }, response: {} }

  interceptorMiddleware.request.use(opt => {
    expect(opt).toMatchObject(ctx.request)
    return opt
  })

  interceptorMiddleware.response.use(opt => {
    expect(opt).toEqual(1)
    return opt
  })

  await interceptorMiddleware.run(ctx, () => {
    ctx.response = 1
    return Promise.resolve()
  })
})
