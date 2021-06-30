import { elementType, merge } from '../src'

test('elementType', async () => {
  expect(elementType(1)).toEqual('number')
  expect(elementType('1')).toEqual('string')
  expect(elementType([])).toEqual('array')
})

test('merge', async () => {
  const objA = { a: { b: { c: { d: 1 } } } }
  const objB = { a: { b: { e: { f: 2 } } } }

  expect(merge(objA, objB)).toMatchObject({
    a: {
      b: {
        c: {
          d: 1,
        },
        e: {
          f: 2,
        },
      },
    },
  })
})
