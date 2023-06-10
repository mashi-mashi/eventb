import { match } from 'ts-pattern';
import { BasePost, PostIdType } from './base_post';
import { PostEvent } from './post_event';
import { PublishedPost } from './published_post';
import { generateId } from '../../lib/generateId';
import { NestedPartial } from '../../lib/type';
import { UserIdType } from '../user/user';

export class Post extends BasePost {
  public readonly id: PostIdType;
  public readonly publishedAt?: Date;

  readonly kind = 'Post';

  public readonly events: PostEvent[] = [];

  private constructor(
    public readonly authorId: UserIdType,
    public readonly title: string,
    public readonly content: string,
    id?: PostIdType,
    publishedAt?: Date,
    events?: PostEvent[],
  ) {
    id = id ?? generateId<'Post'>();
    super(id, authorId, 'Post', title, content, publishedAt, events);

    this.id = id;
    this.publishedAt = publishedAt;
    this.events = events ?? [];
  }

  private copyWith(
    post: NestedPartial<Post> & {
      events: PostEvent[]; /// イベントだけは型セーフ
    },
  ): Post {
    return new Post(
      this.authorId,
      post.title || this.title,
      post.content || this.content,
      undefined,
      post.publishedAt,
      post?.events,
    );
  }

  get isPublished(): boolean {
    return false;
  }

  static of({
    id,
    authorId,
    title,
    content,
    publishedAt,
  }: {
    id: PostIdType;
    authorId: UserIdType;
    title: string;
    content: string;
    publishedAt?: Date;
  }): Post {
    return new Post(authorId, title, content, id, publishedAt);
  }

  static unpublish(publishedPost: PublishedPost): Post {
    return new Post(
      publishedPost.authorId,
      publishedPost.title,
      publishedPost.content,
      publishedPost.id,
      undefined,
      publishedPost.events,
    ).applyEvent({
      entityId: publishedPost.id,
      type: 'PostUnPublishedEvent',
    });
  }

  static create({ authorId, title, content }: { authorId: UserIdType; title: string; content: string }): Post {
    const p = new Post(authorId, '', '');
    return p.applyEvent({
      type: 'PostCreatedEvent',
      entityId: p.id,
      payload: {
        title,
        content,
      },
    });
  }

  public update({ title, content }: { title?: string; content?: string }) {
    return this.applyEvent({
      entityId: this.id,
      type: 'PostUpdatedEvent',
      payload: {
        title,
        content,
      },
    });
  }

  public publish(date: Date) {
    return PublishedPost.fromPost(
      this.applyEvent({
        entityId: this.id,
        type: 'PostPublishedEvent',
        payload: {
          publishedAt: date,
        },
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
      .with({ type: 'PostPublishedEvent' }, (PostPublishedEvent) => {
        return this.copyWith({
          publishedAt: PostPublishedEvent.payload.publishedAt,
          events: [...this.events, PostPublishedEvent],
        });
      })
      .with({ type: 'PostUnPublishedEvent' }, () => {
        return this.copyWith({
          publishedAt: undefined,
          events: [...this.events, event],
        });
      })
      .exhaustive();
  }

  clearEvents(): Post {
    return this.copyWith({
      publishedAt: this.publishedAt,
      events: [],
    });
  }
}
