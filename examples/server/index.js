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

router
  .get('/api', (ctx) => {
    ctx.body = {
      a: 1,
      b: 2,
    }
  })
  .post('/api', (ctx) => {
    ctx.body = {
      a: 1,
      b: 2,
    }
  })

app.use(router.routes()).use(router.allowedMethods())

app.listen(10000, () => console.log('server is start'))
