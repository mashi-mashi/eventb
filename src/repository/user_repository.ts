import { PrismaClient } from '@prisma/client';
import { User, UserIdType } from '../model/user/user';
import { UserSerializerType } from '../serializer/user_serializer';

export type UserRepositoryType = {
  store: (post: Partial<User>) => Promise<User>;
  get: (id: UserIdType) => Promise<User>;
};

export class UserRepositoryOnPrisma implements UserRepositoryType {
  constructor(private readonly prisma: PrismaClient, private readonly serializer: UserSerializerType) {}

  async get(id: UserIdType) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error(`User not found! ${id}`);
    return this.serializer.desrialize(user);
  }

  async store(user: Partial<User>) {
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
