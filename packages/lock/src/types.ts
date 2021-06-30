type Value = any
type GetValue = () => Promise<Value | null>
type SetValue = (v: Value) => void
type ClearValue = () => void

export interface Options {
  getValue: GetValue
  setValue: SetValue
  clearValue: ClearValue
}
