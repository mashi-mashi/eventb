import { NestedPartial } from '../../lib/type'
import { UserIdType } from '../user/user'
import { BasePost, PostIdType } from './base_post'
import { Post } from './post'
import { PostEvent, PublishedPostEvent } from './post_event'

export class PublishedPost extends BasePost {
  readonly kind = 'PublishedPost'

  private constructor(
    public readonly id: PostIdType,
    public readonly authorId: UserIdType,
    public readonly title: string,
    public readonly content: string,
    public readonly publishedAt: Date,
    public readonly events: PublishedPostEvent[],
  ) {
    super(id, authorId, 'PublishedPost', title, content, publishedAt, events)
  }

  get isPublished(): boolean {
    return true
  }

  static of({
    id,
    authorId,
    title,
    content,
    publishedAt,
  }: {
    id: PostIdType
    authorId: UserIdType
    title: string
    content: string
    publishedAt: Date
  }) {
    return new PublishedPost(id, authorId, title, content, publishedAt, [])
  }

  static fromPost(post: Post): PublishedPost {
    if (!post.publishedAt) {
      throw new Error('Post is not published yet.')
    }

    return new PublishedPost(
      post.id,
      post.authorId,
      post.title,
      post.content,
      post.publishedAt,
      post.events,
    )
  }

  public unpublish(): Post {
    return Post.unpublish(this)
  }

  private copyWith(
    post: NestedPartial<PublishedPost> & {
      publishedAt: Date
      events: PostEvent[] /// イベントだけは型セーフ
    },
  ): PublishedPost {
    return new PublishedPost(
      this.id,
      this.authorId,
      post.title ?? this.title,
      post.content ?? this.content,
      post.publishedAt ?? this.publishedAt,
      post?.events ?? this.events,
    )
  }

  clearEvents(): PublishedPost {
    return this.copyWith({
      publishedAt: this.publishedAt,
      events: [],
    })
  }
}
