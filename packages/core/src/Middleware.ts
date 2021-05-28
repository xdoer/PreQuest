import { Context, MiddlewareCallback } from '@prequest/types'
import { Lock } from './Lock'

export class Middleware<T, N> extends Lock {
  protected cbs: MiddlewareCallback<T, N>[] = []

  static globalCbs: any = []

  protected exec(ctx: Context<T, N>, next: MiddlewareCallback<T, N>) {
    let times = -1
    const cbs = <MiddlewareCallback<T, N>[]>[...Middleware.globalCbs, ...this.cbs]
    const dispatch = (pointer = 0): Promise<any> => {
      if (cbs.length < pointer) return Promise.resolve()

      const fn = cbs[pointer] || next

      if (pointer <= times) throw new Error('next function only can be called once')
      times = pointer

      const middleware = () => fn(ctx, () => dispatch(++pointer))

      return this.on ? this.promise.then(() => middleware()) : middleware()
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
