import { createRequestUrl } from '../src'

test('createRequestUrl', () => {
  const baseURL = 'http://localhost:3000'
  const path = '/api'
  const url = 'http://localhost:3000/api'
  const params = { a: 1 }

  expect(createRequestUrl({ baseURL, path })).toEqual(url)
  expect(createRequestUrl({ baseURL, path: '' })).toEqual(baseURL)

  expect(createRequestUrl({ path: `${baseURL}${path}` })).toEqual(url)

  expect(createRequestUrl({ url, path: '' })).toEqual(url)

  expect(createRequestUrl({ url, path: '', params })).toEqual(url + '?a=1')
})
