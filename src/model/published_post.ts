import { EventSourcedEntity } from '../core/event';
import { NestedPartial } from '../lib/type';
import { Post, PostIdType } from './post';
import { PostEvent, PublishedPostEvent } from './post_event';

export class PublishedPost implements EventSourcedEntity<PublishedPostEvent, PublishedPost> {
  readonly kind = 'PublishedPost';

  private constructor(
    public readonly id: PostIdType,
    public readonly title: string,
    public readonly content: string,
    public readonly publishedDate: Date,
    public readonly events: PublishedPostEvent[],
  ) {}

  get lastEvent(): PublishedPostEvent | undefined {
    return this.events.length > 0 ? this.events[this.events.length - 1] : undefined;
  }

  get isPublished(): boolean {
    return true;
  }

  static of({
    id,
    title,
    content,
    publishedDate,
  }: {
    id: PostIdType;
    title: string;
    content: string;
    publishedDate: Date;
  }) {
    return new PublishedPost(id, title, content, publishedDate, []);
  }

  static fromPost(post: Post): PublishedPost {
    if (!post.publishedDate) {
      throw new Error('Post is not published yet.');
    }

    return new PublishedPost(post.id, post.title, post.content, post.publishedDate, post.events);
  }

  public unpublish(): Post {
    return Post.unpublish(this);
  }

  private copyWith(
    post: NestedPartial<PublishedPost> & {
      publishedDate: Date;
      events: PostEvent[]; /// イベントだけは型セーフ
    },
  ): PublishedPost {
    return new PublishedPost(
      this.id,
      post.title ?? this.title,
      post.content ?? this.content,
      post.publishedDate ?? this.publishedDate,
      post?.events ?? this.events,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyEvent(_: PostEvent): PublishedPost {
    throw new Error('Method not implemented.');
  }

  clearEvents(): PublishedPost {
    return this.copyWith({
      publishedDate: this.publishedDate,
      events: [],
    });
  }
}
