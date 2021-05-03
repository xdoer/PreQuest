import { InterceptorMiddleware } from '@prequest/interceptor'
import { Request, Response } from '@prequest/xhr'

const interceptor = new InterceptorMiddleware<Request, Response, Error>()

// 拦截器
interceptor.request
  .use((res) => {
    console.log('请求前拦截器1', res)
    return res
  }, (e) => {
    console.log('请求失败拦截器1', e)
  })
  .use((res) => {
    console.log('请求前拦截器2', res)
    return res
  }, (e) => {
    console.log('请求失败拦截器2', e)
    // Promise.reject(e)
  })

interceptor.response
  .use((res) => {
    console.log('响应成功拦截器1', res)
    return res
  }, (e) => {
    console.log('响应失败拦截器1', e);
    Promise.reject(e)
  })
  .use((res) => {
    console.log('响应成功拦截器2', res)
    return res
  }, (e) => {
    console.log('响应失败拦截器2', e);
    Promise.reject(e)
  })

export { interceptor }
