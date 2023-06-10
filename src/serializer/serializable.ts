import { EventSourcedEntity, EventType } from '../core/event';
import { AnyType } from '../lib/type';

type SerializedEventType = {
  type: string;
  entityId: string;
  payload: object;
  timestamp?: Date;
};

type WithoutTimestamp<T> = Omit<T, 'createdAt' | 'updatedAt'>;

type Serializable<Model extends EventSourcedEntity<Event, AnyType>, Json, Event extends EventType> = {
  serialize(model: Partial<Model>): WithoutTimestamp<Json>;
  desrialize(json: Json): Model;

  serializeEvents(events: Event[]): SerializedEventType[];
};

export { Serializable, WithoutTimestamp };
