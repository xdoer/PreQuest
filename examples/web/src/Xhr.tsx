import React, { FC, useEffect, useState } from 'react'
import { prequest } from '@prequest/xhr'
import { CancelToken } from '@prequest/cancel-token'

export const XhrComponent: FC<{}> = ({ }) => {
  const [data, setData] = useState('')

  useEffect(() => {
    // let cancelToken: any = null

    // const xxx = new CancelToken((v) => {
    //   console.log('----1', v)
    //   cancelToken = v
    // })

    // xxx.promise.then(e => {
    //   console.log('----2', e)
    // })

    // console.log('----------', xxx)

    // cancelToken('hahah')

    const source = CancelToken.source()

    prequest
      .get('http://localhost:10000/api', {
        cancelToken: source.token
      })
      .then(res => {
        console.log('chakanjieguo ', res)
      })
    source.cancel()
  }, [])

  return (
    <div>
      <div> XHr 组件</div>
    </div>
  )
}

