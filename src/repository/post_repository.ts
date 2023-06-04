import { EventSourcedEntity, EventType } from '../core/event';
import { BasePost } from '../model/base_post';
import { Post } from '../model/post';
import { PostEvent } from '../model/post_event';
import { PublishedPost } from '../model/published_post';
import { postSerializer } from '../serializer/post_serializer';
import { JsonType, Serializable } from '../serializer/serializable';

type DataBaseType = {
  store: <T>(any: JsonType<T>) => Promise<void>;
  get: <T>(id: string) => Promise<JsonType<T>>;
};

export type RepositoryType<T extends EventSourcedEntity<E, T>, E extends EventType> = (
  f: (db: DataBaseType, serializer: Serializable<T, E>) => Promise<T>,
) => Promise<T>;

type PostRepositoryType = RepositoryType<BasePost, PostEvent>;

const postRepository: PostRepositoryType = (f) => {
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

export async function createPost(post: BasePost) {
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
