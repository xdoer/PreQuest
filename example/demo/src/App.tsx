import React, { useEffect, useState } from 'react'
import { xhrAdapter } from '../../../src'

function App() {

  useEffect(() => {
    async function req() {
      try {
        const xxx = await xhrAdapter({
          method: 'GET',
          url: 'https://www.baidu.com',
          headers: {},
          timeout: 5000,
          withCredentials: false,
          responseType: 'text'
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
