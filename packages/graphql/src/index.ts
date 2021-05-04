import { PreQuest } from '@prequest/core'
import { CommonObject, MethodsCallback } from '@prequest/types'
import { merge } from './helper'

type PreQuestInstance<T, N> = PreQuest<T, N> & MethodsCallback<T, N>

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8',
}

export function graphql<T, N>(instance: PreQuestInstance<T & { data: CommonObject }, N>) {
  return (query: string, variables: CommonObject, opt?: T) => {
    const { headers, ...other } = (opt || {}) as any

    return instance.post('/graphql', {
      data: JSON.stringify({ query, variables }),
      headers: merge(defaultHeaders, headers),
      ...other
    } as any)
  }
}
