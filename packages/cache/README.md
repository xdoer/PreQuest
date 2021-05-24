# @prequest/cache

Cache Middleware For PreQuest.

## Introduction

You can use this library to cache response data.

## Install

```bash
npm install @prequest/cache
```

## Usage

### Define Types

First, you need define Request, Response types, so you can get intellisense when coding.

```ts
interface Request {
  path: string
  method?: string
  baseURL?: string
}

interface Response {
  data: string
  status: number
}

type Error = globalThis.Error
```

### Create Instance

```ts
import { CacheMiddleware } from '@prequest/cache'

const cache = new CacheMiddleware<Request, Response>({
  ttl: 5000,
  cacheId(opt) {
    const { path, method } = opt
    return `${method}-{path}`
  },
  validateCache(opt) {
    const { path } = opt
    if(path === '/api') return true
    return false
  },
  cacheKernel() {
    const map = new Map()
    return {
      set: map.set,
      get: map.get,
      clear: map.clear
      delete: map.delete
    }
  }
})
```

### Mount Middleware

PreQuest provide two types of middleware, global middleware and instance middleware.

```ts
import { PreQuest } from '@prequest/core'

// For global middleware.
PreQuest.use(cache.run)

// For instance middleware
const instance = PreQuest.create(adapter)
instance.use(cache.run)
```

## Options

### Instance Options

| Option Name   | Type                         | Default                                  | Required | Meaning             |
| ------------- | ---------------------------- | ---------------------------------------- | -------- | ------------------- |
| ttl           | number                       |                                          | false    | cache duration      |
| cacheId       | (opt: RequestOpt) => any     | (opt: RequestOpt) => JSON.stringify(opt) | false    | judge same request  |
| validateCache | (opt: RequestOpt) => boolean |                                          | false    | cache strategy      |
| cacheKernel   | CacheKernel                  | Map                                      | false    | custom cache kernel |

### CacheKernel

This middleware use `Map` to cache data, and you can use `cacheKernel` option change it.

```ts
interface CacheKernel {
  get(id: string): Promise<any>
  set(id: string, value: any): Promise<any>
}
```
