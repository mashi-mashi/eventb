import { Post as PrismaPost } from '@prisma/client';
import { match } from 'ts-pattern';
import { BasePost, PostIdType } from '../model/post/base_post';
import { Post } from '../model/post/post';
import { PostEvent } from '../model/post/post_event';
import { PublishedPost } from '../model/post/published_post';
import { UserIdType } from '../model/user/base_user';
import { Serializable, WithoutTimestamp } from './serializable';

export type PostSerializerType = Serializable<BasePost, PrismaPost, PostEvent>;

export const postSerializer: PostSerializerType = {
  serialize(post) {
    return {
      id: post.id,
      authorId: post.authorId,
      title: post.title,
      content: post.content,
      publishedAt: post.publishedAt,
      kind: post.kind,
    } as WithoutTimestamp<PrismaPost>;
  },
  desrialize(json) {
    return match(json)
      .with({ kind: 'Post' }, (json) => {
        return Post.of({
          id: json.id as PostIdType,
          authorId: json.authorId as UserIdType,
          title: json.title,
          content: json.content,
          publishedAt: json.publishedAt ?? undefined,
        });
      })
      .with({ kind: 'PublishedPost' }, (json) => {
        return PublishedPost.of({
          id: json.id as PostIdType,
          authorId: json.authorId as UserIdType,
          title: json.title,
          content: json.content,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          publishedAt: json.publishedAt!,
        });
      })
      .otherwise(() => {
        throw new Error('Invalid json');
      });
  },
  serializeEvents(events: PostEvent[]) {
    return events.map((event) => {
      return {
        entityId: event.entityId,
        type: event.type,
        payload: event,
      };
    });
  },
};
