import { MiddlewareCallback, Common, Context } from '@prequest/types'

export class Middleware {
  protected cbs: MiddlewareCallback[] = []

  static globalCbs: any = []

  protected exec(ctx: Context, next: MiddlewareCallback, injectOpt: Common = {}) {
    let times = -1
    const cbs = <MiddlewareCallback[]>[...Middleware.globalCbs, ...this.cbs]
    const dispatch = (pointer = 0): Promise<any> => {
      if (cbs.length < pointer) return Promise.resolve()

      const fn = cbs[pointer] || next

      if (pointer <= times) throw new Error('next function only can be called once')
      times = pointer

      return fn(ctx, () => dispatch(++pointer), injectOpt)
    }

    return dispatch()
  }

  use(cb: MiddlewareCallback) {
    this.cbs.push(cb)
    return this
  }

  static use(cb: MiddlewareCallback) {
    Middleware.globalCbs.push(cb)
    return Middleware
  }
}
