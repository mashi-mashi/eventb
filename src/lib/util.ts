export function filteredUndefined<T>(array: (T | undefined)[]): T[] {
  return array.filter((item): item is T => item !== undefined);
}
