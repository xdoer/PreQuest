import { xhrAdapter } from '../../../src/adapter/xhr'
import { fetchAdapter } from '../../../src/adapter/fetch'

const axis = fetchAdapter({ baseURL: 'http://localhost:10000' })

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

// 拦截器
axis.interceptor.request
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

axis.interceptor.response
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

export { axis }
