import fetchAdapter from '@prequest/adapter-fetch'
import xhrAdapter, { Request, Response } from '@prequest/adapter-xhr'
import { InterceptorMiddleware } from '@prequest/middleware-interceptor'

const axis = xhrAdapter({ baseURL: 'http://localhost:10000', responseType: 'text', headers: {} })
// const axis = fetchAdapter({ baseURL: 'http://localhost:10000', responseType: 'text', headers: {} })

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

axis.use(interceptor.run)

// 洋葱模式，中间件
axis
  .use(async (ctx, next) => {
    console.log(1)
    await next()
    console.log(2, ctx)
  })
  .use(async (ctx, next) => {
    console.log(3, ctx)
    await next()
    console.log(4)
  })


export { axis }
