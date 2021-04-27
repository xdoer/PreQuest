import React, { useEffect } from 'react'
import { Axis } from '../../../src'

const axis = new Axis()

axis
  .use(async (ctx, next) => {
    console.log(1)
    await next()
    console.log(2, ctx)
  })
  .use(async (ctx, next) => {
    console.log(3, ctx)
    await next()
    console.log(4)
  })

axis.config.baseURL = 'https://www.baidu.com'

function App() {

  useEffect(() => {
    async function req() {
      try {
        const xxx = await axis.get('/aaa', {
          method: 'post',
          // url: 'https://www.baidu.com',
          baseURL: 'https://jd.com',
          headers: {
            token: '1234455667777877777777'
          },
          timeout: 5000,
          withCredentials: false,
          responseType: 'text',
        })
        console.log('xxx', xxx)
      } catch (e) {
        console.log('报错', e)
      }
    }

    req()
  }, [])

  return (
    <div className="App">
      哈哈哈哈
    </div>
  )
}

export default App
