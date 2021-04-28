import { Axis } from '../../../src'
import { xmlAdapter } from '../../../src/adapter'

const axis = new Axis({ adapter: xmlAdapter })

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

axis.config.baseURL = 'http://localhost:10086'

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
  })

axis.interceptor.response
  .use((res) => {
    console.log('响应成功拦截器1', res)
    return res
  }, (e) => {
    console.log('响应失败拦截器1', e);
  })
  .use((res) => {
    console.log('响应成功拦截器2', res)
    return res
  }, (e) => {
    console.log('响应失败拦截器2', e);
  })

export { axis }