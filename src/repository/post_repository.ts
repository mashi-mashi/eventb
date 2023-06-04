import { Post } from '../model/post';
import { PublishedPost } from '../model/published_post';
import { PostSerializerType, postSerializer } from '../serializer/post_serializer';
import { JsonType } from '../serializer/serializable';

type DataBaseType = {
  store: <T>(any: JsonType<T>) => Promise<void>;
  get: <T>(id: string) => Promise<JsonType<T>>;
};

const postRepository = <T>(f: (db: DataBaseType, serializer: PostSerializerType) => Promise<T>) => {
  return f(
    {
      store: async (any) => {
        console.log('stored!', any);
        return Promise.resolve();
      },
      get: async (id) => {
        throw new Error(`not implemented! ${id}`);
      },
    },
    postSerializer,
  );
};

export async function createPost(post: Post | PublishedPost) {
  return await postRepository(async (db, serializer) => {
    await db.store(serializer.serialize(post));
    await Promise.all(serializer.serializeEvents(post.events).map(db.store));
    return serializer.callback(post);
  });
}

export async function getPost(id: string) {
  return await postRepository(async (db, serializer) => {
    return await db.get<Post | PublishedPost>(id).then(serializer.desrialize);
  });
}
