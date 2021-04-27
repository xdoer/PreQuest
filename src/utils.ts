import { Config } from './types'

export function mergeConfig(...args: Config[]) {
  return args.reduce((t, c) => ({ ...t, ...c }), {} as Config)
}
