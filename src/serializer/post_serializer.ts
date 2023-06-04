import { match } from 'ts-pattern';
import { JsonType, Serializable } from './serializable';
import { BasePost } from '../model/post/base_post';
import { Post } from '../model/post/post';
import { PostEvent } from '../model/post/post_event';
import { PublishedPost } from '../model/post/published_post';

export type PostSerializerType = Serializable<BasePost, PostEvent>;

export const postSerializer: PostSerializerType = {
  serialize(post: Post | PublishedPost) {
    return {
      id: post.id.toString(),
      title: post.title,
      content: post.content,
      publishedDate: post.publishedDate,
      kind: post.kind,
    } as JsonType<Post | PublishedPost>;
  },
  desrialize(json: JsonType<Post | PublishedPost>) {
    return match(json)
      .with({ kind: 'Post' }, (json) => {
        return Post.of({
          id: json.id,
          authorId: json.authorId,
          title: json.title,
          content: json.content,
          publishedDate: json.publishedDate,
        });
      })
      .with({ kind: 'PublishedPost' }, (json) => {
        return PublishedPost.of({
          id: json.id,
          authorId: json.authorId,
          title: json.title,
          content: json.content,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          publishedDate: json.publishedDate!,
        });
      })
      .exhaustive();
  },
  serializeEvents(events: PostEvent[]) {
    return events.map((event) => {
      return JSON.parse(JSON.stringify(event));
    });
  },
  callback(post: Post | PublishedPost) {
    return post.clearEvents();
  },
};
