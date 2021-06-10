import { PreQuestInstance } from '@prequest/core'
import { CommonObject } from '@prequest/types'
import { merge } from '@prequest/utils'

export function graphql<T, N>(instance: PreQuestInstance<T, N>, reqOpt?: T) {
  return (query: string, variables?: CommonObject, opt?: T) => {
    const options = merge(opt, reqOpt)
    const { data, ...rest } = (options || {}) as any
    const finalData = merge({ query, variables }, data)

    return instance.request({
      method: 'post',
      data: JSON.stringify(finalData),
      ...rest,
    })
  }
}
