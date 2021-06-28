import React, { FC, useEffect, useState } from 'react'
import prequest, { Request, Response } from '@prequest/fetch'

export const FetchComponent: FC<{}> = ({ }) => {

  useEffect(() => {
    prequest('https://vodkgeyttp9c.vod.126.net/vodkgeyttp8/LPz7whmr_2809103936_uhd.mp4?ts=1890099466&rid=7859AE92117216E8AD0E345795682128&rl=0&rs=mqcBSVVeGKqfoCTzNGcRVicCgzugnYvd&sign=7811271dbfc6526c0425f698704b7203&coverId=OxmMzhObT-pnAEa-tsAJhQ==/109951164511633534&infoId=134007', {
      onDownloadProgress({ loaded, total }) {
        console.log('查看值', (loaded / total))
      },
      responseType: 'blob'
    }).then(res => {
      console.log('查看值', res)
    })
  }, [])

  return (
    <div>
      <div>fetch 组件</div>
    </div>
  )
}

