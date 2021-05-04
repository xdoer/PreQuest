import React, { useEffect, useState } from 'react'
import { createAxios, createUmiRequest, createXMLPreQuest, createFetchPreQuest, createGraphqlPreQuest } from './request'
import './middleware'

const xxx = ['axios', 'umi', 'preQuest-xml', 'preQuest-fetch', 'graphql']

function App() {
  const [a, setA] = useState(4)

  useEffect(() => {
    switch (a % 5) {
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
        break
      case 4:
        createGraphqlPreQuest()
    }
  }, [a])

  return (
    <div className="App" onClick={() => setA(a => ++a)}>
      {xxx[a % 5]}
    </div>
  )
}

export default App
