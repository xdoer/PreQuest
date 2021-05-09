import React, { FC, useEffect, useState } from 'react'
import { prequest, create } from '@prequest/fetch'
import { adapter, fetchRe } from './proxy'

export const FetchComponent: FC<{}> = ({ }) => {
  const [value, setValue] = useState('空')

  useEffect(() => {
    // adapter({ method: 'post', url: 'http://localhost:10000/api' }).then(res => {
    //   console.log('查看响应', res)
    // })
    // fetchRe({ method: 'post', url: 'http://localhost:10000/api' }).then(res => {
    //   console.log('查看响应2', res)
    // })



    fetchRe.use(async (ctx, next) => {
      console.log('查看请求头', ctx.request)
      await next()
      console.log('查看响应', ctx.response)
    }).post('http://localhost:10000/api', { url: 'http://localhost:10000/api' }).then(res => {
      console.log('查看响应数据', res)
    })


  }, [])

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
      <div>{value}</div>
    </div>
  )
}

