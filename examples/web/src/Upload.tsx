import React, { FC, useEffect, useState } from 'react'
import prequest, { create } from '@prequest/xhr'
import Uploader from '@prequest/uploader'
import '@prequest/types'


const uploader = new Uploader({
  request(formData) {
    return prequest.post('/upload', {
      baseURL: 'http://localhost:8080',
      data: formData,
    })
  }
})

export const UploadComponent: FC<{}> = ({ }) => {
  return (
    <div>
      <div>文件上传</div>
      <input type="file" name="file" onChange={function (e) {
        const files: any = e.target.files
        uploader.upload(files[0])
      }} />
    </div>
  )
}

