import { match } from 'ts-pattern';
import { BasePost, PostIdType } from './base_post';
import { PostEvent } from './post_event';
import { PublishedPost } from './published_post';
import { generateId } from '../../lib/generateId';
import { NestedPartial } from '../../lib/type';
import { UserIdType } from '../user/base_user';

export class Post extends BasePost {
  public readonly id: PostIdType;
  public readonly publishedDate?: Date;

  readonly kind = 'Post';

  public readonly events: PostEvent[] = [];

  private constructor(
    public readonly authorId: UserIdType,
    public readonly title: string,
    public readonly content: string,
    id?: PostIdType,
    publishedDate?: Date,
    events?: PostEvent[],
  ) {
    id = id ?? generateId<'Post'>();
    super(id, authorId, 'Post', title, content, publishedDate, events);

    this.id = id;
    this.publishedDate = publishedDate;
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
      post.publishedDate,
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
    publishedDate,
  }: {
    id: PostIdType;
    authorId: UserIdType;
    title: string;
    content: string;
    publishedDate?: Date;
  }): Post {
    return new Post(authorId, title, content, id, publishedDate);
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
      type: 'PostUnPublishedEvent',
    });
  }

  static create({ authorId, title, content }: { authorId: UserIdType; title: string; content: string }): Post {
    return new Post(authorId, '', '').applyEvent({
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

  public publish(date: Date) {
    return PublishedPost.fromPost(
      this.applyEvent({
        type: 'PostPublishedEvent',
        payload: {
          publishedDate: date,
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
          publishedDate: PostPublishedEvent.payload.publishedDate,
          events: [...this.events, PostPublishedEvent],
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

  clearEvents(): Post {
    return this.copyWith({
      publishedDate: this.publishedDate,
      events: [],
    });
  }
}
