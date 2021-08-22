export function parseOptions<T>(opt: T | ((opt: T) => T), prevOpt: T | null): T | undefined {
  try {
    if (typeof opt === 'function') return (opt as any)(prevOpt)
    return opt
  } catch (e) {
    return
  }
}

export function defaultUpdate<Q>(_: Q, res: Q) {
  return res
}
