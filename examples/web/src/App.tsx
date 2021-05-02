import React, { useEffect, useState } from 'react'
import { createAxios, createUmiRequest, createXMLPreQuest, createFetchPreQuest } from './request'
import './middleware'

const xxx = ['axios', 'umi', 'preQuest-xml', 'preQuest-fetch']

function App() {
  const [a, setA] = useState(2)

  useEffect(() => {
    switch (a % 4) {
      case 0:
        createAxios()
        break
      case 1:
        createUmiRequest()
        break
      case 2:
        createXMLPreQuest()
        break
      case 3:
        createFetchPreQuest()
    }
  }, [a])

  return (
    <div className="App" onClick={() => setA(a => ++a)}>
      {xxx[a % 4]}
    </div>
  )
}

export default App
