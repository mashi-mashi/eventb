import { JsonType, Serializable } from '../core/serializable';
import { Post, PublishedPost } from '../model/post';

type DataBaseType = {
  store: <T>(any: JsonType<T>) => Promise<void>;
};

export type PostSerializer = Serializable<Post | PublishedPost, Event>;

export async function createPost(db: DataBaseType, post: PostSerializer) {
  db.store(post.serialize());
  post.serializeEvents().forEach((event) => {
    db.store(event);
  });

  return post.callback();
}
