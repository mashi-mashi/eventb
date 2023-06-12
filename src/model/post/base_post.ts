import { EventSourcedEntity } from '../../core/event'
import { IdType } from '../../core/generateId'
import { UserIdType } from '../user/user'
import { PostEvent } from './post_event'

export type PostIdType = IdType<'Post'>

type PostKindType = 'Post' | 'PublishedPost'

export abstract class BasePost implements EventSourcedEntity<PostEvent, BasePost> {
  constructor(
    public readonly id: PostIdType,
    public readonly authorId: UserIdType,
    public readonly kind: PostKindType,
    public readonly title: string,
    public readonly content: string,
    public readonly publishedAt?: Date,
    public readonly events: PostEvent[] = [],
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyEvent(event: PostEvent): BasePost {
    throw new Error('Method not implemented.')
  }
  clearEvents(): BasePost {
    throw new Error('Method not implemented.')
  }

  get lastEvent(): PostEvent | undefined {
    return this.events.length > 0 ? this.events[this.events.length - 1] : undefined
  }
}
