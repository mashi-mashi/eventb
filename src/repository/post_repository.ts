import { JsonType, Serializable } from '../core/serializable';
import { Post } from '../model/post';

type DataBaseType = {
  store: (any: JsonType) => void;
};

export type PostSerializer = Serializable<Post>;

export function createPost(db: DataBaseType, post: PostSerializer) {
  post.serialize();
  db.store(post.serialize());
  post.serializeEvents().forEach((event) => {
    db.store(event);
  });
}
