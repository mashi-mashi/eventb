import { match } from 'ts-pattern';
import { EventSourcedEntity, EventType } from '../core/event';
import { NestedPartial } from '../lib/type';
import { generateId } from '../lib/generateId';
import { PostEvent } from './post_event';

class Post implements EventSourcedEntity<PostEvent, Post> {
  public readonly id: string;
  public readonly publishedDate?: Date;

  public readonly events: PostEvent[] = [];

  get lastEvent(): PostEvent {
    return this.events[this.events.length - 1];
  }

  clearEvents(): Post {
    return this.copyWith({
      events: [],
    });
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

  static create({ title, content }: { title: string; content: string }): Post {
    return new Post('', '').applyEvent({
      type: 'PostCreatedEvent',
      payload: {
        title,
        content,
      },
    });
  }

  public update({ title, content }: { title?: string; content?: string }) {
    return this.applyEvent({
      type: 'PostUpdatedEvent',
      payload: {
        title,
        content,
      },
    });
  }

  public publish() {
    return PublishedPost.fromPost(
      this.applyEvent({
        type: 'PostPublishedEvent',
      }),
    );
  }

  applyEvent(event: PostEvent): Post {
    return match(event)
      .with({ type: 'PostCreatedEvent' }, (createdEvent) => {
        return this.copyWith({
          title: createdEvent.payload.title,
          content: createdEvent.payload.content,
          events: [...this.events, createdEvent],
        });
      })
      .with({ type: 'PostUpdatedEvent' }, (updatedEvent) => {
        return this.copyWith({
          title: updatedEvent.payload.title,
          content: updatedEvent.payload.content,
          events: [...this.events, updatedEvent],
        });
      })
      .with({ type: 'PostPublishedEvent' }, () => {
        return this.copyWith({
          publishedDate: new Date(),
          events: [...this.events, event],
        });
      })
      .exhaustive();
  }
}

class PublishedPost implements EventSourcedEntity<EventType, PublishedPost> {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly publishedDate: Date,
    public readonly events: EventType[],
  ) {}

  get lastEvent(): EventType {
    return this.events[this.events.length - 1];
  }

  applyEvent(event: EventType): PublishedPost {
    return match(event).otherwise(() => this);
  }

  private copyWith(
    post: NestedPartial<PublishedPost> & {
      publishedDate: Date;
      events: Event[];
    },
  ): PublishedPost {
    return new PublishedPost(
      post.id ?? this.id,
      post.title ?? this.title,
      post.content ?? this.content,
      post.publishedDate ?? this.publishedDate,
      post.events ?? this.events,
    );
  }

  clearEvents(): PublishedPost {
    return this.copyWith({
      publishedDate: this.publishedDate,
      events: [],
    });
  }

  static fromPost(post: Post): PublishedPost {
    if (!post.publishedDate) {
      throw new Error('Post is not published');
    }

    return new PublishedPost(post.id, post.title, post.content, post.publishedDate, post.events);
  }
}

export { Post, PublishedPost };
