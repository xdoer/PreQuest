import jsonTypesGenerator from 'json-types-generator'
import { prequest } from '@prequest/node'
import { asyncPool, merge } from '@prequest/utils'
import { resolve } from 'path'
import { Options, Item } from './types'
import { getDefaultRootInterfaceName } from './util'

export * from './types'

export default function(options: Options) {
  const {
    data,
    outPutDir,
    requestPoolLimit = 10,
    customRootInterfaceName = getDefaultRootInterfaceName,
  } = options

  return asyncPool<Item, any>(requestPoolLimit, data, item => {
    const config = merge<Required<Item>>(options, item)
    const {
      outPutPath,
      parseResponse,
      rootInterfaceName,
      requestOptions,
      customInterfaceName,
    } = config

    return prequest(requestOptions)
      .then(res => parseResponse(res))
      .then(res =>
        jsonTypesGenerator({
          data: res,
          outPutPath: resolve(outPutDir || '', outPutPath),
          rootInterfaceName: rootInterfaceName || customRootInterfaceName(requestOptions),
          customInterfaceName: customInterfaceName as any,
        })
      )
  })
}
