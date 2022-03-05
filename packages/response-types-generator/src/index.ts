import jsonTypesGenerator from 'json-types-generator'
import { prequest } from '@prequest/node'
import { asyncPool, merge } from '@xdoer/x'
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

    const opt = Object.assign({}, requestOptions, { path })

    return prequest(opt)
      .then(res => parseResponse(res))
      .then(res =>
        jsonTypesGenerator({
          data: res,
          outPutPath: resolve(
            outPutDir || './',
            (outPutFileName || customOutPutFileName(opt)) + '.ts'
          ),
          rootInterfaceName: rootInterfaceName || customRootInterfaceName(opt),
          customInterfaceName: customInterfaceName as any,
        })
      )
  })
}
