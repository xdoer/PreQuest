import React, { useEffect } from 'react'
import { axis } from './Req'

function App() {
  useEffect(() => {
    async function req() {
      try {
        const xxx = await axis.post('/api', {
          // method: 'POST',
          // params: {
          //   a: 1,
          //   b: 2,
          // },
          body: {
            a: 1,
            b: 11
          },
          // baseURL: 'https://jd.com',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            // token: '1234455667777877777777'
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
