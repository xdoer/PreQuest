# 缓存

缓存中间件

## 安装

```bash
npm install @prequest/cache
```

## 使用

```ts
import CacheMiddleware from '@prequest/cache'
import { Request, Response, prequest } from '@prequest/xhr'

const cacheMiddleware = new CacheMiddleware<Request, Response>({
  // 5s 之后，缓存失效
  ttl: 5000,

  // 缓存 ID, 默认直接 JSON.stringify 序列化 opt。你可以通过此函数，判断哪些请求是相同请求。
  cacheId(opt) {
    const { path, method } = opt
    return `${method}-${path}`
  },

  // 校验哪些类型的请求需要缓存数据
  cacheControl(opt) {
    const { pat, method } = opt

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
      clear: map.clear.bind(map),
      delete: map.delete.bind(map),
    }
  },
})

// 注册中间件
prequest.use(cacheMiddleware.run)
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
