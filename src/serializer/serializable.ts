import { AnyType } from '../lib/type';
import { EventSourcedEntity } from '../core/event';

type JsonType<T> = T & {
  __type: 'serializable';
};

type Serializable<T extends EventSourcedEntity<AnyType, AnyType>, E> = {
  serialize(m: T): JsonType<T>;
  desrialize(json: JsonType<T>): T;

  serializeEvents(events: E[]): JsonType<E>[];
  callback(m: T): T;
};

export { Serializable, JsonType };
