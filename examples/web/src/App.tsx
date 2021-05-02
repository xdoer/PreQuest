import React, { useEffect, useState } from 'react'
// import { createAxios, createUmiRequest, createXMLPreQuest } from './axios'
import { axis } from './Req'

const xxx = ['axios', 'umi', 'preQuest-xml', 'preQuest-fetch']

function App() {
  const [a, setA] = useState(3)

  useEffect(() => {
    axis
      .get('/api', { timeout: 5000 })
      .then(res => {
        console.log('查看值-------', res)
        return res
      })
      .catch(e => {
        console.log('错误处', e)
      })
  }, [])

  // useEffect(() => {
  //   switch (a % 4) {
  //     case 0:
  //       createAxios()
  //       break
  //     case 1:
  //       createUmiRequest()
  //       break
  //     case 2:
  //       createXMLPreQuest()
  //     case 3:
  //       createFetchPreQuest()
  //   }
  // }, [a])

  return (
    <div className="App" onClick={() => setA(a => ++a)}>
      {xxx[a % 4]}
    </div>
  )
}

export default App
