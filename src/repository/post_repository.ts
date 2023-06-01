import { JsonType } from '../core/serializable';
import { PostSerializerType } from '../serializer/post_serializer';

type DataBaseType = {
  store: <T>(any: JsonType<T>) => Promise<void>;
};

export async function createPost(db: DataBaseType, post: ReturnType<PostSerializerType>) {
  await db.store(post.serialize());
  await Promise.all(post.serializeEvents().map(db.store));

  return post.callback();
}
