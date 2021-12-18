import { PreQuest } from '@prequest/core'
import { baseOption } from '@prequest/helper'
import { merge } from '@prequest/utils'
import { Request, Response, GetAdapter } from './types'
import { adapter } from './adapter'

type Req<T> = Request & Partial<T>
type Res<N> = Response & N

export function create<T, N>(options?: Req<T>, wrapper: GetAdapter<Req<T>, Res<N>> = (v) => v) {
  return PreQuest.create<Req<T>, Response & N>(wrapper(adapter), merge(baseOption, options))
}
