import { JsonType, Serializable } from '../core/serializable';
import { Post } from '../model/post';
import { PostEvent } from '../model/post_event';

type DataBaseType = {
  store: <T>(any: JsonType<T>) => void;
};

export type PostSerializer = Serializable<Post, PostEvent>;

export function createPost(db: DataBaseType, post: PostSerializer) {
  db.store(post.serialize());
  post.serializeEvents().forEach((event) => {
    db.store(event);
  });

  return post.clearEvents();
}
