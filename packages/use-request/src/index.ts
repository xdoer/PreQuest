import { PreQuestInstance, Config as PreQuestConfig } from '@prequest/types'
import { StateBusManager } from '@xdoer/state-bus'
import { setTimeoutInterval, clearTimeoutInterval } from '@xdoer/timeout-interval'
import { useEffect } from 'react'
import { Config, Cache, GlobalCache } from './types'
import { noop } from './utils'

export default function createQueryHook(prequest: PreQuestInstance) {
  const globalCache: GlobalCache = {}

  function getCache<Q>(key: string, opt: any): Cache<Q> {
    const cached = globalCache[key]
    if (cached?.valid) return cached

    const cache = cached || initCache(key)

    return checkCache(cache, opt)
  }

  function checkCache(cache: Cache, opt: any) {
    try {
      cache.request = typeof opt === 'function' ? opt() : opt
      cache.valid = true
    } catch (e) {
      cache.valid = false
    }
    return cache
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
      timerId: -1,
    }
    return (globalCache[key] = cache)
  }

  const smb = new StateBusManager()

  function useQuery<Q>(
    path: string,
    opt?: PreQuestConfig | (() => PreQuestConfig),
    config?: Config<Q>
  ) {
    const { onUpdate, deps = [], loop, lazy, key } = config || {}
    const _key = key || path
    const cache = getCache<Q>(_key, opt)
    const store = smb.init(_key, {})
    const rerender = store.useState()[1]

    // 所有组件卸载后，删除缓存
    store.hooks.onUnMount = () => {
      delete globalCache[_key]
    }

    // 记录初始的依赖
    useEffect(() => {
      cache.deps = deps
      return () => clearTimeoutInterval(cache.timerId)
    }, [])

    useEffect(() => {
      cache.depsIsChanged = deps.some((v, i) => cache.deps[i] !== v)
      cache.deps = cache.depsIsChanged ? deps : cache.deps

      // 已经初始化过了
      if (cache.called && !cache.depsIsChanged) return

      // lazy 模式只允许手动触发请求
      if (lazy) return

      // 如果参数无效
      if (!checkCache(cache, opt).valid) return

      // 可以发起请求
      cache.called = true
      if (!loop) {
        makeFetch()
        return
      }
      if (cache.timerId === -1) {
        cache.timerId = setTimeoutInterval(makeFetch, loop)
      }
    }, [cache.valid, ...deps])

    // 发起请求
    async function makeFetch(cb = onUpdate) {
      cache.loading = true
      try {
        const res = await prequest<Q>(path, cache.request)
        cache.response = cb?.(res, cache.response) ?? res
      } catch (e) {
        cache.error = e
      }
      cache.loading = false
      rerender({})
    }

    // 停止循环
    cache.stopLoop = () => {
      clearTimeoutInterval(cache.timerId)
      cache.timerId = -1
    }

    // 手动执行请求
    cache.toFetch = (fetchOpt, config) => {
      const newCache = checkCache(cache, opt)

      if (fetchOpt) {
        if (typeof fetchOpt === 'function') {
          // @ts-ignore
          newCache.request = fetchOpt(newCache.request)
        } else {
          newCache.request = fetchOpt
        }
      }

      // 手动执行请求，则认为参数有效
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
