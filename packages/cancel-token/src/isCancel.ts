import { Cancel } from './Cancel'

export function isCancel(value: Cancel) {
  return value.__CANCEL__
}
