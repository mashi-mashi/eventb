import { match } from 'ts-pattern'
import { EventSourcedEntity, EventType } from '../../core/event'
import { IdType, generateId } from '../../core/generateId'
import { NestedPartial } from '../../lib/type'
import { ActorActionType } from '../actor/actor'

export type UserIdType = IdType<'User'>

type UserCreatedEvent = {
  type: 'UserCreatedEvent'
  payload: {
    name: string
    email?: string
  }
} & EventType

export type UserEvent = UserCreatedEvent

export class User implements EventSourcedEntity<UserEvent, User>, ActorActionType {
  public readonly events: UserEvent[] = []
  public readonly kind = 'User'

  private constructor(
    public readonly id: UserIdType,
    public readonly name: string,
    public readonly email: string | undefined,
    events?: UserEvent[],
  ) {
    this.events = events ?? []
  }

  static of({
    id,
    name,
    email,
    events,
  }: {
    id: UserIdType
    name: string
    email?: string
    events?: UserEvent[]
  }): User {
    id = id ?? generateId<'User'>()

    return new User(id, name, email, events)
  }

  applyEvent(event: UserEvent): User {
    return match(event)
      .with({ type: 'UserCreatedEvent' }, () => {
        return this.copyWith({
          events: [...this.events, event],
        })
      })
      .exhaustive()
  }

  private copyWith(
    input: NestedPartial<User> & {
      events: UserEvent[] /// イベントだけは型セーフ
    },
  ): User {
    return User.of({
      id: this.id,
      name: input.name ?? this.name,
      email: input.email ?? this.email,
      events: input.events ?? input.events,
    })
  }

  performAction<T>(usecaseFunction: (user: User) => T): T {
    return usecaseFunction(this)
  }

  clearEvents(): User {
    throw new Error('Method not implemented.')
  }

  get lastEvent(): UserEvent | undefined {
    return this.events.length > 0 ? this.events[this.events.length - 1] : undefined
  }
}
