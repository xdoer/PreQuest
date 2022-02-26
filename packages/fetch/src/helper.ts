import { Config } from '@prequest/types'

export function parseResBody(res: globalThis.Response, options: Config) {
  const { responseType } = options

  switch (responseType) {
    case 'json':
      return res.json()
    case 'blob':
      return res.blob()
    case 'arraybuffer':
      return res.arrayBuffer()
    case 'text':
      return res.text()
    default:
      return res
  }
}
