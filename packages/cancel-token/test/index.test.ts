import CancelToken from '../src'

test('CancelToken', async () => {
  const cancelToken = CancelToken.source()

  cancelToken.cancel()

  await cancelToken.token.promise

  expect(cancelToken.token.isCancel()).toBeTruthy()
})
