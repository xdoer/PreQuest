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

// refer: https://github.com/rxaviers/async-pool/blob/master/lib/es7.js
export const asyncPool = async <T, N>(
  poolLimit: number,
  array: T[],
  iteratorFn: (i: T, list: T[]) => Promise<N>
) => {
  const ret: Promise<N>[] = []
  const executing: Promise<void>[] = []

  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array))
    ret.push(p)

    if (poolLimit <= array.length) {
      const e: Promise<void> = p.then(() => {
        executing.splice(executing.indexOf(e), 1)
      })
      executing.push(e)
      if (executing.length >= poolLimit) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}

type CommonFn = (...args: any) => any

function limit(func: CommonFn, wait: number, debounce: boolean) {
  let timeout: NodeJS.Timeout | null
  return function(...args: any) {
    const throttler = function() {
      timeout = null
      func.apply(null, args)
    }

    if (debounce && timeout) clearTimeout(timeout)
    if (debounce || !timeout) timeout = setTimeout(throttler, wait)
  }
}

export function throttle(func: CommonFn, wait: number) {
  return limit(func, wait, false)
}

export function debounce(func: CommonFn, wait: number) {
  return limit(func, wait, true)
}
