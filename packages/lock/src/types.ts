type Value = any
type GetValue = () => Promise<Value | null>
type SetValue = (v: Value) => Promise<void>
type ClearValue = () => Promise<void>

export interface Options {
  getValue: GetValue
  setValue: SetValue
  clearValue: ClearValue
}
