import deepmerge from 'deepmerge'
import { isPlainObject } from 'is-plain-object'

export const elementType = (ele: any) => {
  const typeStr = Object.prototype.toString.call(ele)
  const reg = /^\[object\s([A-Za-z]+)\]$/
  reg.test(typeStr)
  return RegExp.$1.toLowerCase()
}

export const merge = (...args: (Record<string, any> | undefined)[]) =>
  deepmerge.all(args.filter(Boolean) as any, {
    isMergeableObject: isPlainObject as any,
  })
