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

### 统一配置

```ts
import CacheMiddleware from '@prequest/cache'
import { Request, Response, prequest } from '@prequest/xhr'

const middleware = cacheMiddleware({
  // 5s 之后，缓存失效
  ttl: 5000,

  // 缓存 ID, 默认直接 JSON.stringify 序列化 opt。你可以通过此函数，判断哪些请求是相同请求。
  cacheId(opt) {
    const { path, method } = opt
    return `${method}-${path}`
  },

  // 校验哪些类型的请求需要缓存数据
  cacheControl(opt) {
    const { path, method } = opt

    // api 接口要缓存
    if (path === '/api') return true

    // get 请求要缓存
    if (method === 'GET') return true
    return false
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
})

// 注册中间件
prequest.use(middleware)
```

### 单一配置

可以通过传参 useCache，使得当前接口可以被缓存。当设置了 useCache 参数时，当前接口将不走 cacheControl 逻辑。

```ts
prequest('/api', {
  useCache: true,
})
```

## 配置项

### 实例配置项

| Option Name  | Type                         | Default                                  | Required | Meaning  |
| ------------ | ---------------------------- | ---------------------------------------- | -------- | -------- |
| ttl          | number                       | 0                                        | false    | 缓存时间 |
| cacheId      | (opt: RequestOpt) => any     | (opt: RequestOpt) => JSON.stringify(opt) | false    | 缓存 ID  |
| cacheControl | (opt: RequestOpt) => boolean |                                          | false    | 缓存策略 |
| cacheKernel  | CacheKernel                  | Map                                      | false    | 存储内核 |

### 存储内核

默认使用 Map 数据结构存到内存。你可以通过此函数，自定义数据存储方式。

```ts
interface CacheKernel {
  get(id: string): Promise<any>
  set(id: string, value: any): Promise<any>
  clear(): Promise<any>
  delete(id: string): Promise<any>
}
```
