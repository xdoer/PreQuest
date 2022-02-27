import React, { FC, useEffect } from 'react'
import prequest, { create } from '@prequest/fetch'
import generatorMiddlewareWrapper from '@prequest/response-types-client'
import { PQRequest } from '@prequest/types'

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

prequest.use(middleware)

export const FetchComponent: FC<{}> = ({ }) => {

  useEffect(() => {
    prequest('https://webspiderr.herokuapp.com/crawl/api', {
      params: {
        user: 'xdoer',
        cid: '73b1430d-faa0-44eb-899e-36cf5cbfaec8'
      }
    }).then(res => {
      console.log('查看值')
    })
  }, [])

  return (
    <div>
      <div>fetch 组件</div>
    </div>
  )
}

