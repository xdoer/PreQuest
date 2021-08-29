import React, { FC, useEffect } from 'react'
import prequest, { Request, Response, create } from '@prequest/fetch'
import generatorMiddlewareWrapper from '@prequest/response-types-client'

const defaultOutPutFileName = (requestOption: Request) => {
  return requestOption.path?.replace(/.*\/(\w+)/, (_, __) => __) || ''
}

const defaultRootInterfaceName = (requestOption: Request) => {
  return (
    requestOption.path
      ?.replace(/.*\/(\w+)/, (_, __) => __)
      .replace(/^[a-z]/, a => a.toUpperCase()) || ''
  )
}

const middleware = generatorMiddlewareWrapper<Request, Response>({
  requestAgent: create(),
  endpoint: 'http://localhost:10010/api',
  typesGeneratorConfig(req, res) {
    const outputName = defaultOutPutFileName(req)
    const rootInterfaceName = defaultRootInterfaceName(req)

    return {
      data: res.data,
      outPutPath: `/Users/luckyhh/Desktop/project/prequest2/examples/web/src/types/${outputName}.ts`,
      rootInterfaceName: rootInterfaceName
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
      console.log('查看值', res)
    })
  }, [])

  return (
    <div>
      <div>fetch 组件</div>
    </div>
  )
}

