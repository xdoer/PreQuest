import jsonTypesGenerator from 'json-types-generator'
import { createServer } from 'http'
import { readdir, stat, mkdir } from 'fs/promises'
import { resolve, isAbsolute } from 'path'
import { ServerOptions, ClientOptions } from './types'
import { errorJson } from './util'

export default function(opt?: ServerOptions) {
  const { port = 10086 } = opt || {}
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
          const bodyData = JSON.parse(body) as ClientOptions
          const { outPutDir, outPutName, interfaceName, data, overwrite } = bodyData
          const dirPath = isAbsolute(outPutDir) ? outPutDir : resolve(process.cwd(), outPutDir)

          // 扫描一遍目录，进行初始化
          if (!cachedDirs.length) {
            try {
              await stat(dirPath)
              const dirs = await readdir(dirPath)
              // 剥离文件后缀名
              cachedDirs = dirs.map(dir => dir.replace(/(.+)\.\w+$/, (_, __) => __))
            } catch {
              await mkdir(dirPath)
              cachedDirs = []
            }
          }

          // 当前接口已生成类型
          const generated = cachedDirs.includes(outPutName)

          if (!generated || (generated && overwrite)) {
            await jsonTypesGenerator({
              data,
              overwrite,
              outPutPath: resolve(dirPath, `${outPutName}.ts`),
              rootInterfaceName: interfaceName,
            })
            !generated && cachedDirs.push(outPutName)
          }

          const resData = {
            status: true,
            timestamp: Date.now(),
            error: null,
            data: cachedDirs,
          }
          res.writeHead(200)
          res.end(JSON.stringify(resData))
        } catch (e) {
          const resData = {
            status: false,
            timestamp: Date.now(),
            error: errorJson(e),
            data: cachedDirs,
          }
          res.writeHead(500)
          res.end(JSON.stringify(resData))
        }
      })
    }
  })

  server.listen(port, () => {
    console.log(`Json Types Generator Server running at http://localhost:${port}`)
  })
}
