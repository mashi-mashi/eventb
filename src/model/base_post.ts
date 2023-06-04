import { EventSourcedEntity } from '../core/event';
import { IdType } from '../lib/generateId';
import { AnyType } from '../lib/type';
import { PostEvent } from './post_event';

export type PostIdType = IdType<'Post'>;

type PostKindType = 'Post' | 'PublishedPost';

export abstract class BasePost implements EventSourcedEntity<PostEvent, BasePost> {
  constructor(
    public readonly id: IdType<AnyType>,
    public readonly kind: PostKindType,
    public readonly title: string,
    public readonly content: string,
    public readonly publishedDate?: Date,
    public readonly events: PostEvent[] = [],
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyEvent(event: PostEvent): BasePost {
    throw new Error('Method not implemented.');
  }
  clearEvents(): BasePost {
    throw new Error('Method not implemented.');
  }

  get lastEvent(): PostEvent | undefined {
    return this.events.length > 0 ? this.events[this.events.length - 1] : undefined;
  }
}
