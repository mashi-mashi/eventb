import { AnyType } from '../lib/type';
import { EventSourcedEntity } from '../core/event';

type JsonType<T> = T & {
  __type: 'serializable';
};

type EventType = {
  type: string;
  entityId: string;
  payload: object;
  timestamp?: Date;
};

type Serializable<T extends EventSourcedEntity<AnyType, AnyType>, E> = {
  serialize(m: Partial<T>): JsonType<T>;
  desrialize(json: JsonType<T>): T;

  serializeEvents(events: E[]): EventType[];
  callback(m: T): T;
};

export { Serializable, JsonType };
