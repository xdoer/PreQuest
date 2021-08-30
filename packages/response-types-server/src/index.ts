import jsonTypesGenerator from 'json-types-generator'
import { createServer } from 'http'
import { ServerOptions } from './types'

Object.defineProperty(Error.prototype, 'toJSON', {
  value: function() {
    const alt: any = {}
    const that: any = this

    Object.getOwnPropertyNames(that).forEach(key => (alt[key] = that[key]), that)

    return alt
  },
  configurable: true,
  writable: true,
})

export default function(opt: ServerOptions) {
  const { port } = opt

  const server = createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')

    if (req.method === 'POST') {
      let body = ''
      req.on('data', data => (body += data))
      req.on('end', async function() {
        try {
          await jsonTypesGenerator(JSON.parse(body))
          res.writeHead(200)
          res.end(JSON.stringify({ status: true, timestamp: Date.now(), error: null }))
        } catch (e) {
          res.writeHead(500)
          res.end(JSON.stringify({ status: false, timestamp: Date.now(), error: e }))
        }
      })
    }
  })

  server.listen(port, () => {
    console.log('Json Types Generator Server is start at port:', port)
  })
}
