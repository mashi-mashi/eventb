import { PrismaClient } from '@prisma/client'
import { PostIdType } from '../../model/post/base_post'
import { UserIdType } from '../../model/user/user'

export class PostQuery {
  constructor(private readonly prisma: PrismaClient) {}

  async getPostById(id: PostIdType) {
    const post = await this.prisma.post.findUnique({ where: { id } })
    return post
  }

  async listByAuthorId(authorId: UserIdType) {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: authorId,
      },
    })
    return posts
  }
}
