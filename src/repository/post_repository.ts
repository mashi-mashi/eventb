import { JsonType } from '../serializer/serializable';
import { PostSerializerType } from '../serializer/post_serializer';
import { Post, PublishedPost } from '../model/post';

type DataBaseType = {
  store: <T>(any: JsonType<T>) => Promise<void>;
  get: <T>(id: string) => Promise<JsonType<T>>;
};

export async function createPost(db: DataBaseType, serializer: PostSerializerType, post: Post | PublishedPost) {
  await db.store(serializer.serialize(post));
  await Promise.all(serializer.serializeEvents(post.events).map(db.store));

  return serializer.callback(post);
}

export async function getPost(db: DataBaseType, serializer: PostSerializerType, id: string) {
  return await db.get<Post | PublishedPost>(id).then(serializer.desrialize);
}
