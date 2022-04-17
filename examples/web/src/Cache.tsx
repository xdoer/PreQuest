import React, { FC, useEffect, useState } from 'react'
import { create } from '@prequest/xhr'
import createCache from '@prequest/cache'

const cache = createCache({
  ttl: 6000,
  validateCache: opt => true,
})
const prequest = create({ useCache: true }, cache)

export const CacheComponent: FC<{}> = ({ }) => {
  const [data, setData] = useState('')

  useEffect(() => {
    prequest('https://webspiderr.herokuapp.com/crawl/api', {
      params: {
        user: 'xdoer',
        cid: '73b1430d-faa0-44eb-899e-36cf5cbfaec8'
      }
    })
      .then(res => {
        console.log(1, res)
      }).catch(e => {
        console.log(e)
      })

    setTimeout(() => {
      prequest('https://webspiderr.herokuapp.com/crawl/api', {
        params: {
          user: 'xdoer',
          cid: '73b1430d-faa0-44eb-899e-36cf5cbfaec8'
        },
      })
        .then(res => {
          console.log(2, res)
        }).catch(e => {
          console.log(e)
        })
    }, 3000)

    setTimeout(() => {
      prequest('https://webspiderr.herokuapp.com/crawl/api', {
        params: {
          user: 'xdoer',
          cid: '73b1430d-faa0-44eb-899e-36cf5cbfaec8'
        },
      })
        .then(res => {
          console.log(3, res)
        }).catch(e => {
          console.log(e)
        })
    }, 10000)
  }, [])

  return (
    <div>
      <div> XHr 组件</div>
    </div>
  )
}

