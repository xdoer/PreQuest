import { PreQuestInstance, Config as PreQuestConfig } from '@prequest/types'
import { useStore } from '@xdoer/state-bus'
import { setTimeoutInterval, clearTimeoutInterval } from '@xdoer/timeout-interval'
import { useEffect, useRef } from 'react'
import { Config, Cache, GlobalCache } from './types'
import { noop } from './utils'

export default function createQueryHook(prequest: PreQuestInstance) {
  const globalCache: GlobalCache = {}

  function getCache<Q>(key: string, opt: any): Cache<Q> {
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
      called: false,
      loading: true,
      error: null,
      request: null as any,
      response: null as any,
      stopLoop: noop,
      toFetch: noop,
      deps: [],
      depsIsChanged: false,
    }
    return (globalCache[key] = cache)
  }

  function useQuery<Q>(
    path: string,
    opt?: PreQuestConfig | (() => PreQuestConfig),
    config?: Config<Q>
  ) {
    const { onUpdate, deps = [], loop, lazy, key } = config || {}
    const cache = getCache<Q>(key || path, opt)
    const rerender = useStore(key || path, {})[1]
    const timerRef = useRef<any>()

    // 记录初始的依赖
    useEffect(() => {
      cache.deps = deps
      return () => clearTimeoutInterval(timerRef.current)
    }, [])

    useEffect(() => {
      cache.depsIsChanged = deps.some((v, i) => cache.deps[i] !== v)
      cache.deps = cache.depsIsChanged ? deps : cache.deps

      // 已经初始化过了
      if (cache.called && !cache.depsIsChanged) return

      // lazy 模式只允许手动触发请求
      if (lazy) return

      // 如果参数无效
      if (!checkOptions(cache, opt)) return

      // 可以发起请求
      cache.called = true
      if (!loop) {
        makeFetch()
        return
      }
      if (typeof timerRef.current == 'undefined') {
        timerRef.current = setTimeoutInterval(makeFetch, loop)
      }
    }, [cache.valid, ...deps])

    // 发起请求
    async function makeFetch(cb = onUpdate) {
      cache.loading = true
      try {
        const res = await prequest<Q>(path, cache.request)
        cache.response = cb?.(res as any, cache.response) || res
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

  useQuery.get = <Q = any>(key: string): Cache<Q> => {
    return globalCache[key]
  }

  return useQuery
}
