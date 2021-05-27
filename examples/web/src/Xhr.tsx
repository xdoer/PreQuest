import React, { FC, useEffect, useState } from 'react'
import { prequest } from '@prequest/xhr'
import { CancelToken } from '@prequest/cancel-token'
import { Token } from './Token'

const token = new Token()
prequest.use(token.run)

export const XhrComponent: FC<{}> = ({ }) => {
  const [data, setData] = useState('')

  useEffect(() => {
    prequest
      .get('http://localhost:10000/api', { headers: {} })
      .then(res => {
        console.log('chakanjieguo ', res)
      })
    prequest
      .get('http://localhost:10000/api', { headers: {} })
      .then(res => {
        console.log('chakanjieguo ', res)
      })
    prequest
      .get('http://localhost:10000/api', { headers: {} })
      .then(res => {
        console.log('chakanjieguo ', res)
      })
    prequest
      .get('http://localhost:10000/api', { headers: {} })
      .then(res => {
        console.log('chakanjieguo ', res)
      })
  }, [])

  return (
    <div>
      <div> XHr 组件</div>
    </div>
  )
}

