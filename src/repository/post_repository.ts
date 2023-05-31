import { JsonType, Serializable } from '../core/serializable';
import { Post, PublishedPost } from '../model/post';

type DataBaseType = {
  store: <T>(any: JsonType<T>) => Promise<void>;
};

export type PostSerializer = Serializable<Post | PublishedPost, Event>;

export async function createPost(db: DataBaseType, post: PostSerializer) {
  await db.store(post.serialize());
  await Promise.all(post.serializeEvents().map(db.store));

  return post.callback();
}
