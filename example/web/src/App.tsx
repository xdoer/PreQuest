import React, { useEffect, useState } from 'react'
import { createAxios, createFetchPreQuest, createUmiRequest, createXMLPreQuest } from './axios'

const xxx = ['axios', 'umi', 'preQuest-xml', 'preQuest-fetch']

function App() {
  const [a, setA] = useState(3)

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
