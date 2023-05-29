import { match } from 'ts-pattern';
import { Event, EventSourcedEntity } from '../core/event';
import { generateId } from '../lib/uuid';

type PostEvent = PostCreatedEvent | PostUpdatedEvent | PostPublishedEvent;

type PostCreatedEvent = {
  type: 'PostCreatedEvent';
  payload: {
    title: string;
    content: string;
  };
} & Event;

type PostUpdatedEvent = {
  type: 'PostUpdatedvent';
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

  private constructor(public readonly title: string, public readonly content: string, publishedDate?: Date) {
    this.id = generateId();
    this.publishedDate = publishedDate;
  }

  private copyWith(post: Partial<Post>): Post {
    return new Post(post.title || this.title, post.content || this.content, post.publishedDate);
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
          });
        },
      )
      .with(
        {
          type: 'PostUpdatedvent',
        },
        (updatedEvent) => {
          return this.copyWith({
            title: updatedEvent.payload.title,
            content: updatedEvent.payload.content,
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
          });
        },
      )
      .exhaustive();
  }
}

export { Post };
