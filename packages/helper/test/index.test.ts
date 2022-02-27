import { isEmpty, createRequestUrl, formatRequestBodyAndHeaders } from '../src'

test('isEmpty', () => {
  expect(isEmpty([])).toBeTruthy()
  expect(isEmpty({})).toBeTruthy()
  expect(isEmpty(null)).toBeTruthy()
  expect(isEmpty(undefined)).toBeTruthy()
  expect(isEmpty(0)).toBeTruthy()
})

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

test('formatRequestBodyAndHeaders', () => {
  const ctx = { headers: {}, data: { a: 1 }, requestType: 'json' }

  const { data, headers } = formatRequestBodyAndHeaders(ctx as any)

  expect(data).toEqual('{"a":1}')
  expect(headers).toMatchObject({ 'Content-Type': 'application/json;charset=UTF-8' })
})
