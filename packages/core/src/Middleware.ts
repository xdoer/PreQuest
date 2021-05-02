import { Context, MiddlewareCallback } from '@prequest/types'

export class Middleware<T, N> {
  protected cbs: MiddlewareCallback<T, N>[] = []

  protected exec(ctx: Context<T, N>, next: MiddlewareCallback<T, N>) {
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

  use(cb: MiddlewareCallback<T, N>) {
    this.cbs.push(cb)
    return this
  }
}
