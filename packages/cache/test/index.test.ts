import cache from '../dist'

let i = 0

function adapter(opt: Partial<PQ.PQRequest>): Promise<PQ.PQResponse> {
  return new Promise(resolve => setTimeout(() => resolve(opt.useCache ? ++i : i), 100))
}

const sleep = () => new Promise(resolve => setTimeout(resolve, 250))

const cachedAdapter = cache({ ttl: 250 })(adapter)

test('cache', async () => {
  const start = Date.now()

  await cachedAdapter({ useCache: true, path: '/' })
  await cachedAdapter({ useCache: true, path: '/' })
  const res = await cachedAdapter({ useCache: true, path: '/' })

  expect(Date.now() - start).toBeLessThan(250)
  expect(res).toBe(1)

  await sleep()

  const res2 = await cachedAdapter({ useCache: true, path: '/' })
  expect(res2).toBe(2)
})
