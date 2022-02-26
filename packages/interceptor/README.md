# @prequest/interceptor

拦截器中间件。

中间件模型可以更好的完成修改请求和拦截响应的需求，但为了方便习惯使用 axios 的用户，提供此中间件。

## 安装

```bash
npm install @prequest/interceptor
```

## 使用

```ts
import { prequest } from '@prequest/xhr'
import interceptorMiddleware from '@prequest/interceptor'

const interceptor = new InterceptorMiddleware()

// 修改请求参数
interceptor.request.use(
  request => {
    if (!request.path) throw new Error('can not find path')

    request.path = '/prefix' + request.path

    // 注意要将 request 参数返回
    return request
  },
  error => {
    console.log('modify request path fail', error)
    throw error
  }
)

// 修改响应
interceptor.response.use(
  response => {
    if (response.statusCode === 500) throw new Error('internal error')

    response.data = JSON.parse(response.data)

    // 注意要将 response 返回
    return response
  },
  error => {
    // 如果是某个错误
    if (error.message === 'internal error') {
      // 要进行什么操作

      return
    }

    // 否则将错误继续抛出
    throw error
  }
)

prequest.use(interceptor.run)
```
