import React, { useEffect, useState } from 'react'
import { XhrComponent } from './Xhr'
import { AxiosComponent } from './Axios'
// import { UploadComponent } from './Upload'
import { FetchComponent } from './Fetch'

function App() {

  return (
    <div className="App">
      <XhrComponent />
      {/* <FetchComponent /> */}
      {/* <AxiosComponent /> */}
    </div>
  )
}

export default App
