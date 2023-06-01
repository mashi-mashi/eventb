import { JsonType, Serializable } from '../core/serializable';
import { Post, PublishedPost } from '../model/post';

export type PostSerializerType = (post: Post | PublishedPost) => Serializable<Post | PublishedPost, Event>;

export const postSerializer: PostSerializerType = (post: Post | PublishedPost) => {
  return {
    serialize() {
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        publishedDate: post.publishedDate,
      } as JsonType<Post>;
    },
    serializeEvents() {
      return post.events.map((event) => {
        return JSON.parse(JSON.stringify(event));
      });
    },
    callback() {
      return post.clearEvents();
    },
  };
};
