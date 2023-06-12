export function filteredUndefined<T>(array: (T | undefined)[]): T[] {
  return array.filter((item): item is T => item !== undefined)
}

// export function pipe<A, B>(f: (arg: A) => B): (arg: A) => B;
// export function pipe<A, B, C>(f: (arg: A) => B, g: (arg: B) => C): (arg: A) => C;
// export function pipe<A, B, C, D>(f: (arg: A) => B, g: (arg: B) => C, h: (arg: C) => D): (arg: A) => D;
// export function pipe(...fns: Array<(arg: AnyType) => AnyType>) {
//   return (x: AnyType) => fns.reduce((v, f) => f(v), x);
// }

export function pipe<T>(...fns: Array<(t: T) => T>) {
  return (t: T) => fns.reduce((v, f) => f(v), t)
}

export function performOn<T>(value: T, ...fns: Array<(arg: T) => T>): T {
  return fns.reduce((v, func) => func(v), value)
}
