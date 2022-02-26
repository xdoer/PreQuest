import { PreQuestRequest } from '@prequest/types'

export const defaultOutPutFileName = (requestOption: PreQuestRequest) => {
  return requestOption.path?.replace(/.*\/(\w+)/, (_, __) => __) || ''
}

export const defaultRootInterfaceName = (requestOption: PreQuestRequest) => {
  return (
    requestOption.path
      ?.replace(/.*\/(\w+)/, (_, __) => __)
      .replace(/^[a-z]/, a => a.toUpperCase()) || ''
  )
}

export const defaultParseResponse = (res: any) => res.data
