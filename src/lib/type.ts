export type NestedPartial<T> = {
  [K in keyof T]?: T[K] extends object ? NestedPartial<T[K]> : T[K];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any;
