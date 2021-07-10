import React, { FC, useEffect, useState } from 'react'
import prequest, { Request, Response } from '@prequest/xhr'
import ErrorRetryMiddleware from '@prequest/error-retry'


const errorRetryMiddleware = ErrorRetryMiddleware<Request, Response>({
  retryCount: 2,
  retryControl(opt) {
    const { method } = opt
    return ['GET', 'POST'].includes(method)
  }
})

prequest.use(errorRetryMiddleware)

export const XhrComponent: FC<{}> = ({ }) => {
  const [data, setData] = useState('')

  useEffect(() => {
    prequest
      .get('http://localhost:8080/api', {
        params: { a: 1 }
      })
      .then(res => {
        console.log(1, res)
      })
  }, [])

  return (
    <div>
      <div> XHr 组件</div>
    </div>
  )
}

