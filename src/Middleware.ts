import { Context, MiddlewareCallback } from './types'

export class Middleware {
  cbs: MiddlewareCallback[] = []

  exec(ctx: Context, next: MiddlewareCallback) {
    let times = -1
    const dispatch = (pointer = 0): Promise<any> => {
      if (this.cbs.length < pointer) return Promise.resolve()

      const fn = this.cbs[pointer] || next

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
