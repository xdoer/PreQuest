import { Request, Response } from './types'
import { PreQuest, PreQuestInstance } from './PreQuest'
import { create } from './create'

const instance = new PreQuest()

const prequest: PreQuestInstance = new Proxy(function() {} as any, {
  get(_, name) {
    return Reflect.get(instance, name)
  },
  apply(_, __, args) {
    return Reflect.apply(instance.request, instance, args)
  },
})

export { create, prequest, PreQuest, Request, Response, PreQuestInstance }

export default prequest
