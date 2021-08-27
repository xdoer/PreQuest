import { Request } from '@prequest/node'

export const defaultOutPutFileName = (requestOption: Request) => {
  return requestOption.path?.replace(/.*\/(\w+)/, (_, __) => __) || ''
}

export const defaultRootInterfaceName = (requestOption: Request) => {
  return (
    requestOption.path
      ?.replace(/.*\/(\w+)/, (_, __) => __)
      .replace(/^[a-z]/, a => a.toUpperCase()) || ''
  )
}

export const defaultParseResponse = (res: any) => res.data
