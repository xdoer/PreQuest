# 类型

`PreQuest` 的请求参数类型为 `PQRequest`，响应类型为 `PQResponse`。

```ts
interface PQRequest {
  path: string
  method: Method
}

type PQResponse<T> = any
```

当你想要封装一个请求库时，应该怎么扩展请求库的类型呢？

```ts
declare module '@prequest/types' {
  interface PQRequest {
    baseURL?: string
    headers?: any
  }

  interface PQResponse<T> {
    success: boolean
    result: T
    error: {
      code: string
      message: string
    }
  }
}

export {}
```

`@prequest/types` 包中预置了一些请求参数类型，你可以基于此进行扩展

```ts
/// <reference types="@prequest/types" />

declare module '@prequest/types' {
  interface PQRequest extends PQ.PresetOption {
    timeout?: number
    headers?: PQ.Common
  }

  interface PQResponse<T> {
    success: boolean
    result: T
    error: {
      code: string
      message: string
    }
  }
}

export {}
```
