import { Context, MiddlewareCallback } from '@prequest/types'

export interface MergeRequestInject<T> {
  strategy?: 'debounce' | 'throttle'
  mergeId?(opt: T): string
  mergeControl?(opt: T): boolean
}

export default class MergeRequestMiddleware<T, N> {
  constructor(private opt?: MergeRequestInject<T>) {}

  mergeList: Map<string, X<T, N>> = new Map([])

  getId(opt: T) {
    return this.opt?.mergeId?.(opt) || JSON.stringify(opt)
  }

  run: MiddlewareCallback<T & MergeRequestInject<T>, N> = async (ctx, next): Promise<any> => {
    const id = this.getId(ctx.request)
    const task = this.mergeList.get(id)

    // 将所有请求保存
    if (task) {
      task.instance.push({ ctx, next })
    } else {
      let resolvePromise: any
      this.mergeList.set(id, {
        pending: false,
        promise: new Promise(resolve => (resolvePromise = resolve)),
        resolvePromise,
        instance: [{ ctx, next }],
      })
    }

    //  newTask 一定存在
    const newTask = this.mergeList.get(id)!

    // 接口正在请求中
    if (newTask.pending) {
      const xxx = await newTask.promise
      newTask.instance.forEach(instance => (instance.ctx = xxx))
      return xxx.response
    } else {
      newTask.pending = true

      // 执行请求
      const xx = await new Promise(resolve => {
        setTimeout(() => {
          resolve('相同的请求')
        }, 10000)
      })

      newTask.resolvePromise(xx as any)
    }

    // 请求后将列表清除
    this.mergeList.delete(id)
  }
}

interface X<T, N> {
  pending: boolean
  promise: Promise<any>
  resolvePromise: (v: N) => Promise<N>
  instance: Middleware<T, N>[]
}

interface Middleware<T, N> {
  ctx: Context<T, N>
  next: MiddlewareCallback<T, N>
}
