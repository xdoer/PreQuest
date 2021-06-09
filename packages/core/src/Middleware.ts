import { Context, MiddlewareCallback } from '@prequest/types'

export class Middleware<T, N> {
  protected cbs: MiddlewareCallback<T, N>[] = []

  static globalCbs: any = []

  protected exec(
    ctx: Context<T, N>,
    next: MiddlewareCallback<T, N>,
    injectOpt: Record<string, any> = {}
  ) {
    let times = -1
    const cbs = <MiddlewareCallback<T, N>[]>[...Middleware.globalCbs, ...this.cbs]
    const dispatch = (pointer = 0): Promise<any> => {
      if (cbs.length < pointer) return Promise.resolve()

      const fn = cbs[pointer] || next

      if (pointer <= times) throw new Error('next function only can be called once')
      times = pointer

      return fn(ctx, () => dispatch(++pointer), injectOpt)
    }

    return dispatch()
  }

  use(cb: MiddlewareCallback<T, N>) {
    this.cbs.push(cb)
    return this
  }

  static use<T, N>(cb: MiddlewareCallback<T, N>) {
    Middleware.globalCbs.push(cb)
    return Middleware
  }
}
