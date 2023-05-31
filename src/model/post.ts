import { match } from 'ts-pattern';
import { EventSourcedEntity } from '../core/event';
import { IdType, generateId } from '../lib/generateId';
import { NestedPartial } from '../lib/type';
import { PostEvent, PublishedPostEvent } from './post_event';

class Post implements EventSourcedEntity<PostEvent, Post> {
  public readonly id: IdType;
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

  static fromPublishedPost(publishedPost: PublishedPost): Post {
    return new Post(publishedPost.title, publishedPost.content, publishedPost.publishedDate, publishedPost.events);
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
      .with({ type: 'PostUnPublishedEvent' }, () => {
        return this.copyWith({
          publishedDate: undefined,
          events: [...this.events, event],
        });
      })
      .exhaustive();
  }
}

class PublishedPost implements EventSourcedEntity<PublishedPostEvent, PublishedPost> {
  private constructor(
    public readonly id: IdType,
    public readonly title: string,
    public readonly content: string,
    public readonly publishedDate: Date,
    public readonly events: PublishedPostEvent[],
  ) {}

  get lastEvent(): PublishedPostEvent {
    return this.events[this.events.length - 1];
  }

  static fromPost(post: Post): PublishedPost {
    if (!post.publishedDate) {
      throw new Error('Post is not published yet.');
    }

    return new PublishedPost(post.id, post.title, post.content, post.publishedDate, post.events);
  }

  public unpublish(): Post {
    return Post.fromPublishedPost(this).applyEvent({
      type: 'PostUnPublishedEvent',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyEvent(_: PostEvent): PublishedPost {
    throw new Error('Method not implemented.');
  }

  clearEvents(): PublishedPost {
    throw new Error('Method not implemented.');
  }
}

export { Post, PublishedPost };
