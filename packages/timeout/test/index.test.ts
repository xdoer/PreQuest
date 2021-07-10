import TimeoutMiddleware from '../src'

const timeoutMiddleware = TimeoutMiddleware<any, any>({
  timeout: 1000,
})

test('TimeoutMiddleware', async () => {
  const ctx: any = { request: { method: 'GET' }, response: {} }

  try {
    await timeoutMiddleware(ctx, async () => {
      await sleep(3000)
      ctx.response = 1
      return Promise.resolve()
    })
  } catch (e) {
    expect(e.message).toEqual('timeout')
  }
})

const sleep = (t = 3000) => {
  return new Promise(resolve => {
    setTimeout(resolve, t)
  })
}
