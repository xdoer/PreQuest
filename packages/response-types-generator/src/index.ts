import jsonTypesGenerator from 'json-types-generator'
import { prequest } from '@prequest/node'
import { asyncPool, merge } from '@prequest/utils'
import { Options, IItem } from './types'
import { getDefaultRootInterfaceName } from './util'

export * from './types'

export default function(options: Options) {
  const {
    schema,
    requestPoolLimit = 10,
    customRootInterfaceName = getDefaultRootInterfaceName,
  } = options
  const { data, ...baseConfig } = schema

  return asyncPool<IItem, any>(requestPoolLimit, data, item => {
    const { outPutPath, parseResponse, ...reqConfig } = merge(baseConfig, item)

    return prequest(reqConfig)
      .then(res => parseResponse(res))
      .then(res => {
        return jsonTypesGenerator({
          outPutPath,
          rootInterfaceName: customRootInterfaceName(reqConfig.path),
          data: res,
        })
      })
  })
}
