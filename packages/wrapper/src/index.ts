import { PreQuest } from '@prequest/core'
import { Adapter, MethodsCallback } from '@prequest/types'

export function wrapper<T, N>(adapter: Adapter<T, N>): Fn<T, N> {
  return PreQuest.create<T, N>(adapter)
}

type PreQuestInstance<T, N> = PreQuest<T, N> & MethodsCallback<T, N>

type Fn<T, N> = Adapter<T, N> & PreQuestInstance<T, N>

export default wrapper
