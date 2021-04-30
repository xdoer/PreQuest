import React, { useEffect } from 'react'
import { axis } from './Req'

function App() {
  useEffect(() => {
    async function req() {
      try {
        const xxx = await axis.get('/', {
          method: 'GET',
          // baseURL: 'https://jd.com',
          headers: {
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
