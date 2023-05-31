import { AnyType } from '../lib/type';
import { EventSourcedEntity } from './event';

type JsonType<T> = T & {
  __type: 'serializable';
};

type Serializable<T extends EventSourcedEntity<AnyType, AnyType>, E> = {
  serialize(): JsonType<T>;
  serializeEvents(): JsonType<E>[];
  callback(): T;
};

export { Serializable, JsonType };
