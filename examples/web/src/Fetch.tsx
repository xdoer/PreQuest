import React, { FC, useEffect, useState } from 'react'
import { prequest, create } from '@prequest/fetch'
import { adapter, fetchRe } from './proxy'
import { Cache } from '@prequest/cache'

const cache = new Cache({
  cacheKernel: () => ({
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value))
    },
    get(key) {
      return localStorage.getItem(key)
    }
  }),
  validateCache(opt) {
    console.log('查看参数', opt)
    return false
  }
})

fetchRe.use(cache.run)

export const FetchComponent: FC<{}> = ({ }) => {
  const [value, setValue] = useState('空')
  const [uuid, setUuid] = useState(0)

  useEffect(() => {
    // adapter({ method: 'post', url: 'http://localhost:10000/api' }).then(res => {
    //   console.log('查看响应', res)
    // })
    // fetchRe({ method: 'post', url: 'http://localhost:10000/api' }).then(res => {
    //   console.log('查看响应2', res)
    // })

    fetchRe.post('http://localhost:10000/api', { url: 'http://localhost:10000/api' }).then(res => {
      console.log('查看响应数据', res)
    })

  }, [uuid])

  function reqClain() {
    prequest('http://localhost:10000/api', {})
      .then(res => {
        console.log('查看值', res)
        setValue(JSON.stringify(res))
      })
      .catch(e => {
        console.log('报错', e)
      })
  }

  function reqAlias() {
    prequest.post('http://localhost:10000/api')
      .then(res => {
        console.log('查看值', res)
        setValue(JSON.stringify(res))
      })
      .catch(e => {
        console.log('报错', e)
      })
  }

  function register() {
    const instance = create({ baseURL: 'http://localhost:10000', params: { a: 1 } })
    instance.get('/api').then(res => console.log('查看盒子', res))
  }

  return (
    <div>
      <div>fetch 组件</div>
      <div onClick={() => register()}>注册中间件</div>
      <div onClick={() => reqClain()}>链式调用</div>
      <div onClick={() => reqAlias()}>别名调用</div>
      <div onClick={() => setUuid(Date.now())}>缓存</div>
      <div>{value}</div>
    </div>
  )
}

