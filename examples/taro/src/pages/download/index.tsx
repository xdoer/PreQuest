import { View } from '@tarojs/components'
import { prequest, wxDownload } from '@common/http'
import { useState } from 'react'
import { useEffect } from 'react'

export default function () {
  const [files, setFiles] = useState([])
  const [tempFile, setTempFile] = useState('')

  useEffect(() => {
    prequest('/files').then(res => {
      setFiles(res)
    })
  }, [])

  async function onClick(filename) {
    const xx = await wxDownload('/download', { params: { filename } })
    setTempFile(xx)
  }

  return (
    <View>
      <View>服务器文件列表</View>
      <View>
        {
          files.map(file => {
            return (
              <View key={file} onClick={() => onClick(file)}>{file}</View>
            )
          })
        }
      </View>
      <View>
        文件下载地址
      </View>
      <View>
        {tempFile}
      </View>
    </View>
  )
}