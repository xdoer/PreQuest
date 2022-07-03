# @prequest/cache

缓存器。

## 安装

```bash
npm install @prequest/cache
```

## 使用

下面的示例表示在一分钟内，发起的相同的路径的 GET 请求，都只会调用一次接口，响应相同的数据。

```ts
import { create } from '@prequest/xhr'
import createCacheAdapter from '@prequest/cache'

const cache = createCacheAdapter({
  ttl: 60000,
  getCacheKey: opt => opt.path,
  verifyRequest: opt => !opt.method || opt.method === 'GET',
  verifyResponse: res => {
    if (res.status === 200) return res.data
    throw 'http error'
  },
})

const prequest = create({ useCache: true }, cache)
```

## 配置项

| Option Name    | Type                  | Default                                      | Required | Meaning                      |
| -------------- | --------------------- | -------------------------------------------- | -------- | ---------------------------- |
| ttl            | number                | 60000                                        | false    | 默认一分钟缓存失效           |
| getCacheKey    | (opt: any) => string  | (opt) => opt.path                            | false    | 默认以请求路径作为缓存的 key |
| verifyRequest  | (opt: any) => boolean | opt => !opt.method \|\| opt.method === 'GET' | false    | 默认 GET 请求才会缓存        |
| verifyResponse | (res: any) => any     | res => res                                   | false    | 默认 GET 请求才会缓存        |

同时，发起请求时，设置 `useCache` 为 `true`，且 `verifyRequest` 校验通过，则会缓存请求数据。
