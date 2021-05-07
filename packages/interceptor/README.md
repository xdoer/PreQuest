# @prequest/interceptor

A Interceptor Middleware For PreQuest

## Usage

### Define Types

First, you need define Request, Response, Error types, so that you can get intellisense when coding. If you don't use typescript, ignore this.

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
import { InterceptorMiddleware } from '@prequest/Interceptor'

const interceptor = new InterceptorMiddleware<Request, Response, Error>()

interceptor.request.use(
  opt => {
    if (!opt.path) throw new Error('can not find path')
    opt.path = '/prefix' + opt.path
    return opt
  },
  error => {
    console.log('modify request path fail', error)
  }
)

interceptor.response.use(
  response => {
    response.data = JSON.parse(response.data)
  },
  error => {
    console.log('parse response fail', error)
  }
)
```

### Mount Middleware

PreQuest provide two types of middleware, global middleware and instance middleware.

```ts
import { PreQuest, createPreQuest } from '@prequest/core'

// For global middleware.
PreQuest.use(interceptor.run)

// For instance middleware
const instance = createPreQuest(adapter)
instance.use(interceptor.run)
```
