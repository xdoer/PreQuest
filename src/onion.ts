interface Context { }

type Middleware = (ctx: Context, next: any) => any

export class OnionModel {
  middleware: Middleware[] = []

  exec(ctx: Context, next: Middleware) {
    let times = -1
    const dispatch = (pointer = 0) => {
      // 中间件和回调函数已遍历完
      if (this.middleware.length < pointer) return

      // 当前要执行的中间件
      const fn = this.middleware[pointer] || next

      // next 回调执行次数
      if (pointer <= times) throw new Error()
      times = pointer

      return fn(ctx, () => dispatch(++pointer))
    }
    return dispatch()
  }

  use(cb: Middleware) {
    this.middleware.push(cb)
    return this
  }
}
