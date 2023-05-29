type JsonType = object;

type Serializable = {
  serialize(): JsonType;
  serializeEvents(): JsonType[];
};

export { Serializable, JsonType };
