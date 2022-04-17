import React, { FC, useEffect, useState } from 'react'
import prequest from '@prequest/xhr'
import ErrorRetryMiddleware from '@prequest/error-retry'
import CancelToken from '@prequest/cancel-token'

// const errorRetryMiddleware = ErrorRetryMiddleware({
//   retryCount: 2,
//   retryControl(opt) {
//     const { method } = opt
//     return ['GET', 'POST'].includes(method)
//   }
// })

// prequest.use(errorRetryMiddleware)

export const XhrComponent: FC<{}> = ({ }) => {
  const [data, setData] = useState('')

  useEffect(() => {
    const source = CancelToken.source()
    prequest('https://webspiderr.herokuapp.com/crawl/api', {
      params: {
        user: 'xdoer',
        cid: '73b1430d-faa0-44eb-899e-36cf5cbfaec8'
      },
      // responseType: 'json'
      cancelToken: source.token,
    })
      .then(res => {
        console.log(1, res)
      }).catch(e => {
        console.log(e)
      })
    // source.cancel()
  }, [])

  return (
    <div>
      <div> XHr 组件</div>
    </div>
  )
}

