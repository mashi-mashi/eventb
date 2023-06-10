import { AnyType } from '../lib/type';
import { EventSourcedEntity } from '../core/event';

type EventType = {
  type: string;
  entityId: string;
  payload: object;
  timestamp?: Date;
};

type WithoutTimestamp<T> = Omit<T, 'createdAt' | 'updatedAt'>;

type Serializable<T extends EventSourcedEntity<AnyType, AnyType>, JsonType, E> = {
  serialize(m: Partial<T>): WithoutTimestamp<JsonType>;
  desrialize(json: JsonType): T;

  serializeEvents(events: E[]): EventType[];
};

export { Serializable, WithoutTimestamp };
