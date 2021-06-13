import React, { FC, useEffect, useState } from 'react'
import oldAxios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { PreQuest } from '@prequest/core'

const prequest = PreQuest.create<AxiosRequestConfig, AxiosResponse>(oldAxios)

export const FetchComponent: FC<{}> = ({ }) => {

  async function onClick() {
    try {
      const res = await prequest({
        url: 'http://localhost:8080/api'
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

