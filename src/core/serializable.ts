type JsonType<T> = T & {
  __type: 'serializable';
};

type Serializable<T, E> = {
  serialize(): JsonType<T>;
  serializeEvents(): JsonType<E>[];
  clearEvents(): T;
};

export { Serializable, JsonType };
