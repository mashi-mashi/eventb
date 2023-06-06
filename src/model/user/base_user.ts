import { EventSourcedEntity, EventType } from '../../core/event';
import { IdType } from '../../lib/generateId';

export type UserIdType = IdType<'User'>;

type UserCreatedEvent = {
  type: 'UserCreatedEvent';
  payload: {
    name: string;
    email?: string;
  };
} & EventType;

export type UserEvent = UserCreatedEvent;

export abstract class BaseUser implements EventSourcedEntity<UserEvent, BaseUser> {
  constructor(
    public readonly id: UserIdType,
    public readonly kind = 'User',
    public readonly name: string,
    public readonly email?: string,
    public readonly events: UserEvent[] = [],
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyEvent(event: UserEvent): BaseUser {
    throw new Error('Method not implemented.');
  }
  clearEvents(): BaseUser {
    throw new Error('Method not implemented.');
  }

  get lastEvent(): UserEvent | undefined {
    return this.events.length > 0 ? this.events[this.events.length - 1] : undefined;
  }
}
