import { MiddlewareCallback } from '@prequest/types'

export class Token {

  token = ''

  promiseResolve: any = null
  promise = new Promise((resolve) => this.promiseResolve = resolve)

  pending = false

  getToken(): Promise<any> {
    if (!this.token) {
      if (this.pending) {
        return this.promise
      }

      this.pending = true
      return new Promise((resolve) => {
        console.log('------')
        setTimeout(() => {
          resolve(1000)
          this.promiseResolve(1000)
        }, 3000)
      })

    } else {
      return Promise.resolve(this.token)
    }
  }

  run: MiddlewareCallback<any, any> = async (ctx, next) => {
    await this.getToken()
      .then((token) => {
        ctx.request.headers['token'] = token
      })
      .then(() => next())
  }
}

