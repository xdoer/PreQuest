import { PreQuestInstance } from '@prequest/core'
import { CommonObject } from '@prequest/types'
import { merge } from '@prequest/utils'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8',
}

export function graphql<T, N>(instance: PreQuestInstance<T, N>) {
  return (query: string, variables: CommonObject, opt?: T) => {
    const { headers, data, ...other } = (opt || {}) as any
    const finalData = merge({ query, variables }, data)
    const finalHeaders = merge(defaultHeaders, headers)
    return instance.post('/graphql', {
      data: JSON.stringify(finalData),
      headers: finalHeaders,
      ...other,
    } as any)
  }
}
