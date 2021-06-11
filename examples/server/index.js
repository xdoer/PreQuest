const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

app.use(bodyParser())

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  )
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
})

let token = '' + Math.random()

// setTimeout(() => {
//   token = Math.random()
// }, 10000)

router
  .get('/api', async (ctx) => {
    // const [, innerToken] = ctx.request.url.match(/token=(.+)/) || []

    // // console.log('----', innerToken, token)

    // if(!innerToken) throw new Error('没有token')
    // if(innerToken !== token) throw new Error('token失效')

    // if(Math.random() > 0.5) {
      ctx.throw(500, 'random error')
      return
    // }

    // ctx.body = {
    //   a: 1,
    //   b: 2,
    // }
  })
  .get('/token', async (ctx) => {
    ctx.body = { token }
  })
  .post('/api', async (ctx) => {
    // if(Math.random() > 0.5) {
      ctx.throw(500, 'post random error')
      return
    // }
    // ctx.body = {
    //   a: 1,
    //   b: 2,
    // }
  })

app.use(router.routes()).use(router.allowedMethods())

app.listen(10000, () => console.log('server is start'))
