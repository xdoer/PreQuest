// import jsonTypesGenerator from 'json-types-generator'
import { createServer } from 'http'
import { MiddlewareCallback, PreQuestInstance } from '@prequest/types'

export function generatorServer() {
  const server = createServer((req, res) => {
    if (req.method === 'POST') {
      let body = ''
      req.on('data', data => (body += data))
      req.on('end', function() {
        // TODO: handle body
        // const { res, req } = JSON.parse(body)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('post received')
      })
    }
  })

  server.listen(10001, () => {
    console.log('Server is start')
  })
}

export function generatorMiddlewareWrapper<T, N>(
  prequestInstance: PreQuestInstance<T, N>
): MiddlewareCallback<T, N> {
  return async (ctx, next) => {
    await next()

    try {
      const res = await prequestInstance.post('http://localhost:10001', {
        body: {
          req: ctx.request,
          res: ctx.response,
        },
      } as any)
      console.log('类型生成成功', res)
    } catch (e) {
      console.log('类型生成失败')
    }
  }
}

export default generatorServer
