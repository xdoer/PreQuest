import ErrorRetryMiddleware from '../src'

const errorRetryMiddleware = new ErrorRetryMiddleware<any, any>({
  // 错误重试次数
  retryCount: 3,

  // opt 为 Request 类型，通过该函数，你可以控制那些接口需要错误重试
  retryControl(opt, e) {
    const { method, path } = opt

    // 如果是具体某个错误，则不进行重试
    if (e?.message === 'internal error') return false

    // api 路径不进行错误重试
    if (path === '/api') return false

    // 只有 get 方法才进行错误重试
    return method === 'GET'
  },
})

test('error-retry', async () => {
  // 错误重试
  let count = 0

  // 初始化 ctx
  const ctx: any = {
    request: { method: 'GET' },
    response: {},
    context: {
      // controller 函数实际上回重走一遍中间件逻辑，这里简写了，原理一致
      controller() {
        count++
        return Promise.resolve(1)
      },
    },
  }

  await errorRetryMiddleware.run(
    ctx,
    () => {
      throw new Error()
    },
    {}
  )

  expect(count).toBe(1)
})

test('error-not-retry', async () => {
  // 错误重试
  let count = 0

  // 初始化 ctx
  const ctx: any = {
    request: { path: '/api' },
    response: {},
    context: {
      // controller 函数实际上回重走一遍中间件逻辑，这里简写了，原理一致
      controller() {
        count++
        return Promise.resolve(1)
      },
    },
  }

  try {
    // 不进行错误重试，错误会冒泡
    await errorRetryMiddleware.run(
      ctx,
      () => {
        throw new Error()
      },
      {}
    )
  } catch (e) {
    expect(count).toBe(0)
  }
})
