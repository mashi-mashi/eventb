import { PrismaClient } from '@prisma/client'
import { BasePost, PostIdType } from '../../model/post/base_post'
import { PostSerializerType } from '../serializer/post_serializer'

export class PostRepositoryOnPrisma {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly serializer: PostSerializerType,
  ) {}

  async get(id: PostIdType) {
    const post = await this.prisma.post.findUnique({ where: { id } })
    if (!post) throw new Error(`Post not found! ${id}`)
    return this.serializer.desrialize(post)
  }

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
    ])

    return this.serializer.desrialize(updated)
  }
}
