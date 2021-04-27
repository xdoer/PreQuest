import { Axis } from '../../../src'
import { xmlAdapter } from '../../../src/adapter'

const axis = new Axis({ adapter: xmlAdapter })

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

axis.interceptor.request.use()
axis.interceptor.response.use()

export { axis }
