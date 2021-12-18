import { PreQuest } from '@prequest/core'
import { Request, Response, RequestCore, GetAdapter } from './types'
import { adapter } from './adapter'

type Req<T> = Request & Partial<T>
type Res<N> = Response & N

export function create<T, N>(request: RequestCore, instanceOpt?: Req<T>, wrapper: GetAdapter<Req<T>, Res<N>> = (v) => v) {
  return PreQuest.create<Req<T>, Res<N>>(wrapper(adapter(request)), instanceOpt)
}
