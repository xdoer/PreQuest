import React, { FC, useEffect, useState } from 'react'
import { prequest } from '@prequest/xhr'
import { prequest as fetch } from '@prequest/fetch'
import { createLockWrapper, Lock } from '@prequest/lock'

const localWrapper = createLockWrapper()

function getToken() {
  return fetch('/token', { baseURL: 'http://localhost:10000' }).then(res => res.data.token)
}

prequest.use(async (ctx, next) => {
  const token = await localWrapper(getToken)
  ctx.request.params = { token }
  await next()
})

export const XhrComponent: FC<{}> = ({ }) => {
  const [data, setData] = useState('')

  useEffect(() => {
    prequest
      .get('http://localhost:10000/api', { params: { a: 1 } })
      .then(res => {
        console.log(1, res)

        // lock.value = null

        // prequest
        //   .get('http://localhost:10000/api')
        //   .then(res => {
        //     console.log('2 ', res)
        //   })
      })


    // setTimeout(() => {
    //   prequest
    //     .get('http://localhost:10000/api')
    //     .then(res => {
    //       console.log('10s ', res)
    //     })
    //     .catch(e => {
    //       console.log('查看报错1', e)
    //       tokenLock.data = null

    //       prequest
    //         .get('http://localhost:10000/api')
    //         .then(res => {
    //           console.log('12s ', res)
    //         })
    //         .catch(e => {
    //           console.log('查看报错2', e)
    //         })

    //     })

    // }, 10000)

  }, [])

  return (
    <div>
      <div> XHr 组件</div>
    </div>
  )
}

