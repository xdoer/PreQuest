# @prequest/cache

缓存器。

## 安装

```bash
npm install @prequest/cache
```

## 使用

```ts
import { create, Request, Response } from '@prequest/xhr'
import createCache, { CacheInject } from '@prequest/cache'

const cache = createCache({
  ttl: 60000,
  getCacheKey: opt => opt.path + opt.method,
  validateCache: opt => opt.method === 'GET',
  cacheKernel: () => {
    function get(key) {
      const value = localStorage.getItem(key)
      if (value) return JSON.parse(value)
    }

    function set(key, value) {
      localStorage.set(key, JSON.stringify(value))
    }

    return {
      get,
      set,
    }
  },
})

const prequest = create<CacheInject>({ useCache: true }, cache)
```

## 配置项

| Option Name   | Type                                                                      | Default                     | Required | Meaning                      |
| ------------- | ------------------------------------------------------------------------- | --------------------------- | -------- | ---------------------------- |
| ttl           | number                                                                    | 60000                       | false    | 默认一分钟缓存失效           |
| getCacheKey   | (opt: any) => string                                                      | (opt) => opt.path           | false    | 默认以请求路径作为缓存的 key |
| validateCache | (opt: any) => boolean                                                     | opt => opt.method === 'GET' | false    | 默认 GET 请求才会缓存        |
| cacheKernel   | () => { get: key => Promise\<any\>, set: (key, value) => Promise\<void\>} | opt => new Map()            | false    | 默认存到 map 数据结构中      |

同时，发情请求时，设置 `useCache` 为 `true`，且 `validateCache` 校验通过，则会缓存请求数据。
