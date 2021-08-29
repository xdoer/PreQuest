import jsonTypesGenerator from 'json-types-generator'
import { createServer } from 'http'
import { ServerOptions } from './types'

export default function(opt: ServerOptions) {
  const { port } = opt

  const server = createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')

    if (req.method === 'POST') {
      let body = ''
      req.on('data', data => (body += data))
      req.on('end', function() {
        generate(body)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('post received')
      })
    }
  })

  server.listen(port, () => {
    console.log('Server is start', port)
  })
}

function generate(body: string) {
  const { data, outPutPath, rootInterfaceName } = JSON.parse(body)
  jsonTypesGenerator({ data, outPutPath, rootInterfaceName })
}
