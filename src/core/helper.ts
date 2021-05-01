export function mergeConfig<T>(...args: T[]): T {
  return args.reduce((t, c) => ({ ...t, ...c }), {} as T)
}
