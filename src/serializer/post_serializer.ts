import { JsonType, Serializable } from './serializable';
import { Post, PublishedPost } from '../model/post';
import { match } from 'ts-pattern';
import { PostEvent } from '../model/post_event';

export type PostSerializerType = Serializable<Post | PublishedPost, PostEvent>;

export const postSerializer: PostSerializerType = {
  serialize(post: Post | PublishedPost) {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      publishedDate: post.publishedDate,
    } as JsonType<Post>;
  },
  desrialize(json: JsonType<Post | PublishedPost>) {
    return match(json)
      .with({ kind: 'Post' }, (json) => {
        return Post.initialize({
          id: json.id,
          title: json.title,
          content: json.content,
          publishedDate: json.publishedDate,
        });
      })
      .with({ kind: 'PublishedPost' }, (json) => {
        return PublishedPost.initialize({
          id: json.id,
          title: json.title,
          content: json.content,
          publishedDate: json.publishedDate,
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
