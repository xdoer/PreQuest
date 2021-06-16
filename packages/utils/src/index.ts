export const elementType = (ele: any) => {
  const typeStr = Object.prototype.toString.call(ele)
  const reg = /^\[object\s([A-Za-z]+)\]$/
  reg.test(typeStr)
  return RegExp.$1.toLowerCase()
}

// deep merge common object
export const merge = (...args: (Record<string, any> | undefined)[]) => {
  return args.reduce((t, c) => {
    if (!c) return t

    const data = Object.entries(c)
    const length = data.length

    for (let i = 0; i < length; i++) {
      const [key, value] = data[i]

      if (elementType(value) === 'object') {
        t[key] = merge(t[key], value)
      } else {
        Object.assign(t, { [key]: value })
      }
    }

    return t
  }, {} as any)
}

/**
 * 对象转URL参数
 * @param searchObj 默认空对象
 */
export const convertObjToSearchParams = (searchObj: Record<string, any> = {}) => {
  let searchParams = ''
  for (let i in searchObj) {
    searchParams = searchParams + `${encodeURIComponent(i)}=${encodeURIComponent(searchObj[i])}&`
  }
  return searchParams.slice(0, -1)
}

/**
 * URL参数转对象
 */
export const convertSearchParamsToObj = (searchParams = '') => {
  const obj: Record<string, any> = {}
  const param = searchParams.match(/([^&=\?]+)=?([^&]*)/g)
  if (!param) return {}
  for (let i of param) {
    const [key, value] = i.split('=')
    obj[key] = decodeURI(value)
  }
  return obj
}
