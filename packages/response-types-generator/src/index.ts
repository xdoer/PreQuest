import jsonTypesGenerator from 'json-types-generator'
import { prequest } from '@prequest/node'
import { asyncPool, merge } from '@prequest/utils'
import { Options, Item } from './types'
import { getDefaultRootInterfaceName } from './util'

export * from './types'

export default function(options: Options) {
  const {
    data,
    customRootInterfaceName = getDefaultRootInterfaceName,
    requestPoolLimit = 10,
  } = options

  return asyncPool<Item, any>(requestPoolLimit, data, item => {
    const { outPutPath, parseResponse, rootInterfaceName, requestOptions } = merge<Required<Item>>(
      options,
      item
    )

    return prequest(requestOptions)
      .then(res => parseResponse(res))
      .then(res => {
        return jsonTypesGenerator({
          outPutPath,
          rootInterfaceName: rootInterfaceName || customRootInterfaceName(requestOptions),
          data: res,
        })
      })
  })
}
