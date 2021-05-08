import { PreQuestBaseInstance } from '@prequest/core'
import { CommonObject } from '@prequest/types'
import { merge } from '@prequest/utils'

export function graphql<T, N>(instance: PreQuestBaseInstance<T, N>) {
  return (query: string, variables?: CommonObject, opt?: T) => {
    const { data, ...rest } = (opt || {}) as any
    const finalData = merge({ query, variables }, data)

    return instance.request({
      method: 'post',
      data: JSON.stringify(finalData),
      ...rest,
    })
  }
}
