import { NestedPartial } from '../../lib/type';
import { UserIdType } from '../user/base_user';
import { BasePost, PostIdType } from './base_post';
import { Post } from './post';
import { PostEvent, PublishedPostEvent } from './post_event';

export class PublishedPost extends BasePost {
  readonly kind = 'PublishedPost';

  private constructor(
    public readonly id: PostIdType,
    public readonly authorId: UserIdType,
    public readonly title: string,
    public readonly content: string,
    public readonly publishedDate: Date,
    public readonly events: PublishedPostEvent[],
  ) {
    super(id, authorId, 'PublishedPost', title, content, publishedDate, events);
  }

  get isPublished(): boolean {
    return true;
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
    publishedDate: Date;
  }) {
    return new PublishedPost(id, authorId, title, content, publishedDate, []);
  }

  static fromPost(post: Post): PublishedPost {
    if (!post.publishedDate) {
      throw new Error('Post is not published yet.');
    }

    return new PublishedPost(post.id, post.authorId, post.title, post.content, post.publishedDate, post.events);
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
      this.authorId,
      post.title ?? this.title,
      post.content ?? this.content,
      post.publishedDate ?? this.publishedDate,
      post?.events ?? this.events,
    );
  }

  clearEvents(): PublishedPost {
    return this.copyWith({
      publishedDate: this.publishedDate,
      events: [],
    });
  }
}
