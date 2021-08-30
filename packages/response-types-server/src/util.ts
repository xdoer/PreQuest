export function errorJson(error: any = {}) {
  error.toJSON = function() {
    return Object.getOwnPropertyNames(error).reduce((t, c) => {
      t[c] = error[c]
      return t
    }, {} as any)
  }
  return error
}
