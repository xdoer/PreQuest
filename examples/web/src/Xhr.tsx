import React, { FC, useEffect, useState } from 'react'
import { prequest } from '@prequest/xhr'
import { ErrorRetryMiddleware } from '@prequest/error-retry'


const errorRetryMiddleware = new ErrorRetryMiddleware({
  retryCount: 2,
  retryControl(opt) {
    const { method } = opt
    return ['get', 'post'].includes(method)
  }
})

prequest.use(errorRetryMiddleware.run)

export const XhrComponent: FC<{}> = ({ }) => {
  const [data, setData] = useState('')

  useEffect(() => {
    prequest
      .get('http://localhost:10000/api', {
        params: { a: 1 }
      })
      .then(res => {
        console.log(1, res)
      })
    prequest
      .post('http://localhost:10000/api', {
        params: { a: 2 }
      })
      .then(res => {
        console.log(2, res)
      })
  }, [])

  return (
    <div>
      <div> XHr 组件</div>
    </div>
  )
}

