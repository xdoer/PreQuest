import React, { FC, useEffect } from 'react'
import prequest, { create } from '@prequest/fetch'
import generatorMiddlewareWrapper from '@prequest/response-types-client'
import { PQRequest } from '@prequest/types'
import CancelToken from '@prequest/cancel-token'
import timeout from '@prequest/timeout'

prequest.use(timeout)

const defaultOutPutFileName = (requestOption: PQRequest) => {
  return requestOption.path?.replace(/.*\/(\w+)/, (_, __) => __) || ''
}

const defaultRootInterfaceName = (requestOption: PQRequest) => {
  return (
    requestOption.path
      ?.replace(/.*\/(\w+)/, (_, __) => __)
      .replace(/^[a-z]/, a => a.toUpperCase()) || ''
  )
}

const middleware = generatorMiddlewareWrapper({
  httpAgent: create(),
  outPutDir: '',
  enable: false,
  typesGeneratorConfig(req, res) {
    const outputName = defaultOutPutFileName(req)
    const rootInterfaceName = defaultRootInterfaceName(req)

    return {
      data: res.data as any,
      outPutName: '',
      overwrite: false,
      outPutPath: `/Users/luckyhh/Desktop/project/prequest2/examples/web/src/types/${outputName}.ts`,
      rootInterfaceName: rootInterfaceName,
      interfaceName: '',
    }
  }
})

export const FetchComponent: FC<{}> = ({ }) => {

  useEffect(() => {
    const cancel = CancelToken.source()

    prequest('https://webspiderr.herokuapp.com/crawl/api', {
      params: {
        user: 'xdoer',
        cid: '73b1430d-faa0-44eb-899e-36cf5cbfaec8'
      },
      responseType: 'json',
      cancelToken: cancel.token,
      timeout: 100
    })
      .then(console.log)
      .catch(e => {
        console.log(111, e.code)
      })
    // setTimeout(() => cancel.cancel(), 1000)
    // cancel.cancel()


  }, [])

  return (
    <div>
      <div>fetch 组件</div>
    </div>
  )
}
