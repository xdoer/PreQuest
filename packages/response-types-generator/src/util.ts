import { Request } from '@prequest/node'

export const getDefaultRootInterfaceName = (requestOption: Request) => {
  return requestOption.path!.replace(/.*\/(\w+)/, (_, __) => __)
}
