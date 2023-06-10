import { PrismaClient } from '@prisma/client';
import { BaseUser, UserIdType } from '../model/user/base_user';
import { UserSerializerType } from '../serializer/user_serializer';

export type UserRepositoryType = {
  store: (post: Partial<BaseUser>) => Promise<BaseUser>;
  get: (id: UserIdType) => Promise<BaseUser>;
};

export class UserRepositoryOnPrisma implements UserRepositoryType {
  constructor(private readonly prisma: PrismaClient, private readonly serializer: UserSerializerType) {}

  async get(id: UserIdType) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error(`User not found! ${id}`);
    return this.serializer.desrialize(user);
  }

  async store(user: Partial<BaseUser>) {
    const [updated] = await this.prisma.$transaction([
      this.prisma.user.upsert({
        where: { id: user.id },
        create: this.serializer.serialize(user),
        update: this.serializer.serialize(user),
      }),

      this.prisma.event.createMany({
        data: this.serializer.serializeEvents(user.events ?? []),
        skipDuplicates: true,
      }),
    ]);

    return this.serializer.desrialize(updated);
  }
}
