import { PreQuestInstance } from '@prequest/core'
import { useStore } from '@xdoer/state-bus'
import { setTimeoutInterval, clearTimeoutInterval } from '@xdoer/timeout-interval'
import { useEffect, useRef } from 'react'
import { Config, Cache, GlobalCache } from './types'
import { noop } from './utils'

export default function createQueryHook<T, N>(prequest: PreQuestInstance<T, N>) {
  const globalCache: GlobalCache = {}

  function getCache<T, Q>(key: string, opt: any): Cache<T, Q> {
    const cached = globalCache[key]
    if (cached?.valid) return cached

    const cache = cached || initCache(key)

    try {
      cache.request = typeof opt === 'function' ? opt() : opt
      cache.valid = true
    } catch (e) {
      cache.valid = false
    }

    return cache
  }

  function refreshCache(cache: Cache, opt: any) {
    try {
      cache.request = typeof opt === 'function' ? opt() : opt
      cache.valid = true
    } catch (e) {
      cache.valid = false
    }
    return cache
  }

  function checkOptions(cache: Cache, opt: any) {
    return refreshCache(cache, opt).valid
  }

  function initCache(key: string) {
    const cache = {
      valid: true,
      loading: true,
      error: null,
      request: null as any,
      response: null as any,
      stopLoop: noop,
      toFetch: noop,
    }
    return (globalCache[key] = cache)
  }

  function useQuery<Q>(path: string, opt?: T | (() => T), config?: Config<Q>) {
    const { onUpdate, deps = [], loop, lazy, key } = config || {}
    const cache = getCache<T, Q>(key || path, opt)
    const rerender = useStore(key || path, {})[1]
    const timerRef = useRef<any>()

    useEffect(() => {
      // lazy 模式只允许手动触发请求
      if (lazy) return

      // 如果参数无效
      if (!checkOptions(cache, opt)) return

      if (!loop) {
        makeFetch()
        return
      }
      if (typeof timerRef.current == 'undefined') {
        timerRef.current = setTimeoutInterval(makeFetch, loop)
      }
    }, [cache.valid, ...deps])

    useEffect(() => () => clearTimeoutInterval(timerRef.current), [])

    // 发起请求
    async function makeFetch(cb = onUpdate) {
      cache.loading = true
      try {
        const res = await prequest<Q>(path, cache.request)
        cache.response = cb?.(cache.response, res as any) || res
      } catch (e) {
        cache.error = e
      }
      cache.loading = false
      rerender({})
    }

    // 停止循环
    cache.stopLoop = () => {
      clearTimeoutInterval(timerRef.current)
      timerRef.current = undefined
    }

    // 手动执行请求
    cache.toFetch = (fetchOpt, config) => {
      const newCache = refreshCache(cache, opt)

      if (fetchOpt) {
        if (typeof fetchOpt === 'function') {
          // @ts-ignore
          newCache.request = fetchOpt(newCache.request)
        } else {
          newCache.request = fetchOpt
        }
      }

      newCache.valid = true
      makeFetch(config?.onUpdate)
    }

    return cache
  }

  useQuery.get = (key: string): Cache<T> => {
    return globalCache[key]
  }

  return useQuery
}
