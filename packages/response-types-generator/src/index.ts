import jsonTypesGenerator from 'json-types-generator'
import { prequest } from '@prequest/node'
import { asyncPool, merge } from '@prequest/utils'
import { resolve } from 'path'
import { Options, Item } from './types'
import { defaultRootInterfaceName, defaultParseResponse, defaultOutPutFileName } from './util'

export * from './types'

export default function(options: Options) {
  const {
    data,
    outPutDir,
    requestPoolLimit = 10,
    customOutPutFileName = defaultOutPutFileName,
    customRootInterfaceName = defaultRootInterfaceName,
  } = options

  return asyncPool<Item, any>(requestPoolLimit, data, item => {
    const {
      path,
      outPutFileName,
      requestOptions,
      rootInterfaceName,
      customInterfaceName,
      parseResponse = defaultParseResponse,
    } = merge<Required<Item>>(options, item)

    // 子配置项中的 path 优先级最高
    Object.assign(requestOptions, { path: item.path || path })

    return prequest(requestOptions)
      .then(res => parseResponse(res))
      .then(res =>
        jsonTypesGenerator({
          data: res,
          outPutPath: resolve(
            outPutDir || './',
            (outPutFileName || customOutPutFileName(requestOptions)) + '.ts'
          ),
          rootInterfaceName: rootInterfaceName || customRootInterfaceName(requestOptions),
          customInterfaceName: customInterfaceName as any,
        })
      )
  })
}
