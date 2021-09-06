# @prequest/cache

缓存中间件

## 安装

```bash
npm install @prequest/cache
```

## 使用

### 类型注入

类型注入需要创建实例，通过类型注入，可以在写代码时，获得智能提示。

```ts
import { create, Request, Response } from '@prequest/xhr'
import CacheMiddleware, { CacheInject } from '@prequest/cache'

const prequest = create<CacheInject>()
```

### 创建中间件

```ts
import createCacheMiddleware from '@prequest/cache'
import { Request, Response, prequest } from '@prequest/xhr'

const middleware = createCacheMiddleware({
  // 开启缓存中间件，默认为 false
  enable: true,

  // 默认1s 之后，缓存失效
  ttl: 1000,

  // 缓存 ID, 默认 ID 为 path。
  requestId(opt) {
    const { path, method } = opt
    return `${method}-${path}`
  },

  // 缓存内核，默认使用 Map 数据结构存到内存。你可以通过此函数，自定义数据存储方式。
  cacheKernel() {
    const map = new Map()
    return {
      set: map.set.bind(map),
      get: map.get.bind(map),
      delete: map.delete.bind(map),
    }
  },

  // 缓存控制，默认只有 GET 请求会使用缓存
  cacheControl(req) {
    return req.method === 'GET' || !req.method
  },
})

// 注册中间件
prequest.use(middleware)
```

### 请求配置

```ts
prequest('/api', {
  // 当前接口不走缓存
  useCache: false,

  // 失效时间
  ttl: 2000

  // 使用缓存，且在缓存没失效的情况下，校验缓存
  validateCache(req, res) {
    return true
  }
})
```

## 配置项

### 创建中间件配置项

| Option Name  | Type                        | Default                                  | Required | Meaning                           |
| ------------ | --------------------------- | ---------------------------------------- | -------- | --------------------------------- |
| enable       | boolean                     | false                                    | false    | 开启缓存中间件                    |
| ttl          | number                      | 0                                        | false    | 默认缓存时间                      |
| requestId    | (opt: RequestOpt) => string | (opt: RequestOpt) => opt.path            | false    | 缓存 ID                           |
| cacheKernel  | CacheKernel                 | Map                                      | false    | 存储内核                          |
| cacheControl | (opt:RequestOpt) => boolean | (opt:RequestOpt) => opt.method === 'GET' | false    | 缓存控制，默认只有 GET 请求会缓存 |

### 请求配置项

| Option Name   | Type                            | Default    | Required | Meaning  |
| ------------- | ------------------------------- | ---------- | -------- | -------- |
| useCache      | boolean                         | false      | false    | 开启缓存 |
| ttl           | number                          | 0          | false    | 缓存时间 |
| validateCache | (cacheReq, cacheRes) => boolean | () => true | false    | 校验缓存 |

### 存储内核

默认使用 Map 数据结构存到内存。你可以通过此函数，自定义数据存储方式。

```ts
interface CacheKernel {
  get(id: string): Promise<any>
  set(id: string, value: any): Promise<any>
  delete(id: string): Promise<any>
}
```
