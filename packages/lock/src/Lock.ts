type Value = any
type GetValue = () => Promise<Value>
type SetValue = (v: Value) => Promise<void>

interface Options {
  getValue: GetValue
  setValue: SetValue
}

export class Lock {
  on = false

  value: Value = null
  getValue: GetValue
  setValue: SetValue

  constructor(opt?: Options) {
    this.getValue = opt?.getValue || (() => this.value)
    this.setValue = opt?.setValue || ((v: any) => (this.value = v))
  }

  resolvePromise: any
  promise = new Promise(resolve => (this.resolvePromise = resolve))
}
