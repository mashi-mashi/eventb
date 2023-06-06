import { PrismaClient } from '@prisma/client';
import { EventSourcedEntity, EventType } from '../core/event';
import { AnyType } from '../lib/type';
import { BasePost } from '../model/post/base_post';
import { PostEvent } from '../model/post/post_event';
import { postSerializer } from '../serializer/post_serializer';
import { JsonType, Serializable } from '../serializer/serializable';

type DataBaseType = {
  store: <T>(any: JsonType<T>) => Promise<void>;
  get: <T>(id: string) => Promise<JsonType<T>>;
};

// export type RepositoryType<T extends EventSourcedEntity<E, T>, E extends EventType> = (
//   f: (db: DataBaseType, serializer: Serializable<T, E>) => Promise<T>,
// ) => Promise<T>;

// export type PostRepositoryType = RepositoryType<BasePost, PostEvent>;

// export const postRepository: PostRepositoryType = (f) => {
//   return f(
//     {
//       store: async (any) => {
//         console.log('stored!', any);
//         return Promise.resolve();
//       },
//       get: async (id) => {
//         throw new Error(`not implemented! ${id}`);
//       },
//     },
//     postSerializer,
//   );
// };

export type PostRepositoryType = {
  store: (post: Partial<BasePost>) => Promise<BasePost>;
};

export class PostRepositoryOnPrisma implements PostRepositoryType {
  constructor(private readonly prisma: PrismaClient, private readonly serializer: Serializable<BasePost, PostEvent>) {}

  async store(post: Partial<BasePost>) {
    const [updated] = await this.prisma.$transaction([
      this.prisma.post.upsert({
        where: { id: post.id },
        create: this.serializer.serialize(post),
        update: this.serializer.serialize(post),
      }),

      this.prisma.event.createMany({
        data: this.serializer.serializeEvents(post.events ?? []),
        skipDuplicates: true,
      }),
    ]);

    /// TODO:
    return this.serializer.desrialize(updated as AnyType as JsonType<BasePost>);
  }
}
