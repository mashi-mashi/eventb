import { BiTemporalArticle, PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

type BiTemporalType<
  T extends {
    validFrom: Date
    validTo: Date
  },
> = Omit<T, 'biTemporalId' | 'createdAt' | 'deletedAt'>

export class BiTemporalArticleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async store(article: BiTemporalType<BiTemporalArticle>) {
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
            validTo: dayjs(article.validFrom).subtract(1, 'millisecond').toDate(), // 1ms前にする
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
