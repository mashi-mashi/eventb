type JsonType = object & {
  __type: 'serializable';
};

type Serializable<T> = {
  serialize(): JsonType;
  serializeEvents(): JsonType[];
} & {
  __value: T;
};

export { Serializable, JsonType };
