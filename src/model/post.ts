import { match } from 'ts-pattern';
import { Event, EventSourcedEntity } from '../core/event';
import { generateId } from '../lib/uuid';
import { NestedPartial } from '../lib/type';

type PostEvent = PostCreatedEvent | PostUpdatedEvent | PostPublishedEvent;

type PostCreatedEvent = {
  type: 'PostCreatedEvent';
  payload: {
    title: string;
    content: string;
  };
} & Event;

type PostUpdatedEvent = {
  type: 'PostUpdatedEvent';
  payload: {
    title?: string;
    content?: string;
  };
} & Event;

type PostPublishedEvent = {
  type: 'PostPublishedEvent';
} & Event;

class Post implements EventSourcedEntity<Post> {
  public readonly id: string;
  public readonly publishedDate?: Date;

  public readonly events: PostEvent[] = [];

  get lastEvent(): PostEvent {
    return this.events[this.events.length - 1];
  }

  private constructor(
    public readonly title: string,
    public readonly content: string,
    publishedDate?: Date,
    events?: PostEvent[],
  ) {
    this.id = generateId();
    this.publishedDate = publishedDate;
    this.events = events ?? [];
  }

  private copyWith(
    post: NestedPartial<Post> & {
      events: PostEvent[]; /// イベントだけは型セーフ
    },
  ): Post {
    return new Post(post.title || this.title, post.content || this.content, post.publishedDate, post?.events);
  }

  static create(event: PostCreatedEvent): Post {
    return new Post(event.payload.title, event.payload.content).applyEvent(event);
  }

  applyEvent(event: PostEvent): Post {
    return match(event)
      .with(
        {
          type: 'PostCreatedEvent',
        },
        (createdEvent) => {
          return this.copyWith({
            title: createdEvent.payload.title,
            content: createdEvent.payload.content,
            events: [...this.events, createdEvent],
          });
        },
      )
      .with(
        {
          type: 'PostUpdatedEvent',
        },
        (updatedEvent) => {
          return this.copyWith({
            title: updatedEvent.payload.title,
            content: updatedEvent.payload.content,
            events: [...this.events, updatedEvent],
          });
        },
      )
      .with(
        {
          type: 'PostPublishedEvent',
        },
        () => {
          return this.copyWith({
            publishedDate: new Date(),
            events: [...this.events, event],
          });
        },
      )
      .exhaustive();
  }
}

export { Post };
