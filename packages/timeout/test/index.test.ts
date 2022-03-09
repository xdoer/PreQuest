import timeoutMiddleware from '../src'

test('TimeoutMiddleware', async () => {
  const ctx: any = { request: { method: 'GET', timeout: 100 }, response: {} }

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

const sleep = (t = 200) => {
  return new Promise(resolve => {
    setTimeout(resolve, t)
  })
}
