import { Context, MiddlewareCallback } from './types'

export class Middleware {
  cbs: MiddlewareCallback[] = []

  exec(ctx: Context, next: MiddlewareCallback) {
    let times = -1
    const dispatch = (pointer = 0) => {
      // 中间件和回调函数已遍历完
      if (this.cbs.length < pointer) return

      // 当前要执行的中间件
      const fn = this.cbs[pointer] || next

      // next 回调执行次数
      if (pointer <= times) throw new Error('next function only can be called once')
      times = pointer

      return fn(ctx, () => dispatch(++pointer))
    }
    return dispatch()
  }

  use(cb: MiddlewareCallback) {
    this.cbs.push(cb)
    return this
  }
}
