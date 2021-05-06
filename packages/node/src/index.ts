import { PreQuest } from '@prequest/core'
import http from 'http'
import https from 'https'
import { Request, Response } from './types'

export * from './types'
export * from '@prequest/core'

const createPreQuest = (options?: Request) => {
  return PreQuest.createInstance<Request, Response>(adapter, options)
}

export { createPreQuest }

export default createPreQuest

function adapter(options: Request): Promise<Response> {
  const { protocol = 'https:' } = options

  const request = protocol === 'https' ? https.request : http.request

  return new Promise((resolve, reject) => {
    const req = request(options, res => {
      const { statusCode, headers } = res
      let data = ''
      res.on('data', d => (data += d))
      res.on('end', () => resolve({ data: JSON.parse(data), status: statusCode!, headers }))
      res.on('error', reject)
    })

    req.end()
  })
}
