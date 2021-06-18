# 拦截器

拦截器中间件

## 安装

```bash
npm install @prequest/interceptor
```

## 使用

```ts
import { prequest, Request, Response } from '@prequest/xhr'
import interceptorMiddleware from '@prequest/interceptor'

const interceptor = new InterceptorMiddleware<Request, Response>()

// 修改请求参数
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

// 修改响应
interceptor.response.use(
  response => {
    response.data = JSON.parse(response.data)
  },
  error => {
    console.log('parse response fail', error)
  }
)

prequest.use(interceptor.run)
```
