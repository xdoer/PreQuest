import React, { FC, useEffect, useState } from 'react'
import oldAxios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { PreQuest } from '@prequest/core'

declare module '@prequest/types' {
  interface PQRequest extends AxiosRequestConfig { }
  interface PQResponse extends AxiosResponse { }
}

const prequest = PreQuest.create(
  (opt) => {
    const { path, ...rest } = opt
    // @ts-ignore
    return oldAxios(path!, rest)
  }
)

export const AxiosComponent: FC<{}> = ({ }) => {

  useEffect(() => {
    prequest('https://webspiderr.herokuapp.com/crawl/api', {
      params: {
        user: 'xdoer',
        cid: '73b1430d-faa0-44eb-899e-36cf5cbfaec8'
      },
      // responseType: 'text'
    }).then(res => {
      console.log('查看响应', res)

    })
  }, [])

  async function onClick() {
    try {
      const res = await prequest('https://webspiderr.herokuapp.com/crawl/api', {
        params: {
          user: 'xdoer',
          cid: '73b1430d-faa0-44eb-899e-36cf5cbfaec8'
        },
        responseType: 'text'
      })
      console.log('查看响应', res)
    } catch (e) {
      console.log('报错', e)
    }
  }

  return (
    <div>
      <div>与 axios 一同使用</div>
      <div onClick={() => onClick()}>点击请求</div>
    </div>
  )
}

