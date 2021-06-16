import React, { FC, useEffect, useState } from 'react'
import prequest, { Request, Response } from '@prequest/fetch'

export const FetchComponent: FC<{}> = ({ }) => {

  useEffect(() => {
    prequest.create()
  }, [])

  return (
    <div>
      <div>fetch 组件</div>
    </div>
  )
}

