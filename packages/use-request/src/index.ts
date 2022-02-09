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
      const _ = typeof opt === 'function' ? opt() : opt
      cache.request = { path: key, ..._ }
      cache.valid = true
    } catch (e) {
      cache.valid = false
    }

    return cache
  }

  function refreshRequestOptions(cache: Cache, opt: any) {
    try {
      // @ts-ignore
      const _ = typeof opt === 'function' ? opt() : opt
      cache.request = { ...cache.request, ..._ }
      cache.valid = true
    } catch (e) {
      cache.valid = false
    }
  }

  function initCache(key: string) {
    const cache = {
      valid: true,
      called: false,
      loading: true,
      error: null,
      request: null as any,
      response: null as any,
      stop: noop,
      query: noop,
    }
    return (globalCache[key] = cache)
  }

  return function<Q>(path: string, opt?: T | (() => T), config?: Config<Q>) {
    const cache = getCache<T, Q>(path, opt)
    const { onUpdate, deps = [], loop, lazy } = config || {}
    const rerender = useStore(path, {})[1]
    const timerRef = useRef<any>()

    // 初次加载
    useEffect(() => {
      if (!cache.valid || cache.called || lazy) return
      cache.called = true
      fetch()
    }, [cache.valid])

    // 依赖变更
    useEffect(() => {
      if (!cache.valid || !cache.called || !deps.length) return

      // 获取最新的参数
      refreshRequestOptions(cache, opt)

      if (!cache.valid) return

      fetch()
    }, [...deps])

    // 卸载时清除计时器
    useEffect(() => {
      return () => {
        clearTimeoutInterval(timerRef.current)
      }
    }, [])

    // 请求控制
    function fetch() {
      if (!loop) {
        makeFetch()
        return
      }
      clearTimeoutInterval(timerRef.current)
      timerRef.current = setTimeoutInterval(makeFetch, loop)
    }

    // 发起请求
    async function makeFetch() {
      cache.loading = true
      try {
        const res = await prequest<Q>(cache.request)
        cache.response = onUpdate?.(cache.response, res as any) || res
      } catch (e) {
        cache.error = e
      }
      cache.loading = false
      rerender({})
    }

    // 停止循环
    cache.stop = () => {
      if (!loop) return console.warn('Loop 模式可用')
      clearTimeoutInterval(timerRef.current)
    }

    // lazy 模式下，需要调用 fetch
    cache.query = () => {
      if (!lazy) return console.warn('Lazy 模式可用')
      if (!cache.valid || cache.called) return
      refreshRequestOptions(cache, opt)
      if (!cache.valid) return
      cache.called = true
      fetch()
    }

    return cache
  }
}
