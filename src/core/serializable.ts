type JsonType<T> = object & {
  __type: T;
};

type Serializable<T> = {
  serialize(): JsonType<T>;
  serializeEvents(): JsonType<T>[];
};

export { Serializable, JsonType };
