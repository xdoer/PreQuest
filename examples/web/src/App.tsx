import React, { useEffect, useState } from 'react'
import { XhrComponent } from './Xhr'
import { AxiosComponent } from './Axios'
// import { UploadComponent } from './Upload'
import { FetchComponent } from './Fetch'
// import { CacheComponent } from './Cache'

function App() {

  return (
    <div className="App">
      {/* <XhrComponent /> */}
      <FetchComponent />
      {/* <AxiosComponent /> */}
      {/* <CacheComponent /> */}
    </div>
  )
}

export default App
