import { match } from 'ts-pattern';
import { BaseUser, UserEvent, UserIdType } from './base_user';
import { NestedPartial } from '../../lib/type';
import { generateId } from '../../lib/generateId';
import { ActorActionType } from '../actor/actor';

export class User extends BaseUser implements ActorActionType {
  public readonly events: UserEvent[] = [];

  private constructor(
    public readonly name: string,
    public readonly email: string | undefined,
    id?: UserIdType,
    events?: UserEvent[],
  ) {
    id = id ?? generateId<'User'>();
    super(id, 'User', name, email, events);

    this.id;
    this.events = events ?? [];
  }

  static of({ id, name, email, events }: { id: UserIdType; name: string; email?: string; events?: UserEvent[] }): User {
    return new User(name, email, id, events);
  }

  applyEvent(event: UserEvent): BaseUser {
    return match(event)
      .with({ type: 'UserCreatedEvent' }, () => {
        return this.copyWith({
          events: [...this.events, event],
        });
      })
      .exhaustive();
  }

  private copyWith(
    input: NestedPartial<User> & {
      events: UserEvent[]; /// イベントだけは型セーフ
    },
  ): User {
    return User.of({
      id: this.id,
      name: input.name ?? this.name,
      email: input.email ?? this.email,
      events: input.events ?? input.events,
    });
  }

  performAction<T>(usecaseFunction: (user: User) => T): T {
    return usecaseFunction(this);
  }
}
