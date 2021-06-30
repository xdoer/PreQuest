import { isAbsoluteURL, isEmpty, createRequestUrl, formatRequestBodyAndHeaders } from '../src'

test('isAbsoluteURL', () => {
  expect(isAbsoluteURL('http://localhost')).toBeTruthy()
  expect(isAbsoluteURL('http://localhost:3000')).toBeTruthy()
  expect(isAbsoluteURL('https://localhost')).toBeTruthy()
  expect(isAbsoluteURL('https://localhost:3000')).toBeTruthy()
  expect(isAbsoluteURL('ftp://localhost')).toBeTruthy()
  expect(isAbsoluteURL('ftp://192.168.1.1')).toBeTruthy()
})

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

  const { data, headers } = formatRequestBodyAndHeaders(ctx)

  expect(data).toEqual('{"a":1}')
  expect(headers).toMatchObject({ 'Content-Type': 'application/json;charset=UTF-8' })
})
