import { BiTemporalArticle, PrismaClient } from '@prisma/client'

export class BiTemporalArticleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async store(article: Omit<BiTemporalArticle, 'biTemporalId' | 'createdAt' | 'deletedAt'>) {
    await this.prisma.$transaction(async (tx) => {
      const latest = await tx.biTemporalArticle.findFirst({
        where: {
          id: article.id,
          validFrom: { lte: article.validFrom },
          validTo: { gte: article.validTo },
        },
        orderBy: { createdAt: 'desc' },
      })

      if (latest) {
        await tx.biTemporalArticle.update({
          where: { biTemporalId: latest.biTemporalId },
          data: {
            validTo: article.validFrom, // 1ms前にする
            deletedAt: new Date(),
          },
        })
      }

      await tx.biTemporalArticle.create({
        data: {
          ...article,
          validTo: '9999-12-31T23:59:59.999Z', // 未来にする
          deletedAt: null,
        },
      })
    })
  }
}
