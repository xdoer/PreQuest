import jsonTypesGenerator from 'json-types-generator'
import { createServer } from 'http'
import { readdir, stat, mkdir } from 'fs/promises'
import { resolve } from 'path'
import { ServerOptions, ClientOptions } from './types'
import { errorJson } from './util'

export default function(opt: ServerOptions) {
  const { port } = opt
  let cachedDirs: string[] = []

  const server = createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')

    if (req.method === 'POST') {
      let body = ''
      req.on('data', data => (body += data))
      req.on('end', async function() {
        try {
          const { outPutDir, outPutName, interfaceName, data, overwrite } = JSON.parse(
            body
          ) as ClientOptions
          const name = `${outPutName}.ts`

          // 扫描一遍目录，进行初始化
          if (!cachedDirs.length) {
            try {
              await stat(outPutDir)
              cachedDirs = await readdir(outPutDir)
            } catch {
              await mkdir(outPutDir)
              cachedDirs = []
            }
          }

          // 当前接口已生成类型
          const generated = cachedDirs.includes(name)

          if (!generated || (generated && overwrite)) {
            await jsonTypesGenerator({
              data,
              overwrite,
              outPutPath: resolve(outPutDir, name),
              rootInterfaceName: interfaceName,
            })
            !generated && cachedDirs.push(name)
          }

          res.writeHead(200)
          res.end(
            JSON.stringify({ status: true, timestamp: Date.now(), error: null, data: cachedDirs })
          )
        } catch (e) {
          res.writeHead(500)
          res.end(
            JSON.stringify({
              status: false,
              timestamp: Date.now(),
              error: errorJson(e),
              data: cachedDirs,
            })
          )
        }
      })
    }
  })

  server.listen(port, () => {
    console.log('Json Types Generator Server is start at port:', port)
  })
}
