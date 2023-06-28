import { PrismaClient } from '@prisma/client'
import { CreatePostUseCase } from './application/command/create_post_use_case'
import { PostQuery } from './application/query/post_query'
import { Container } from './container'
import { Logger } from './core/logger'
import { performOn } from './core/util'
import { PostRepositoryOnPrisma } from './infrastructure/repository/post_repository'
import { UserRepositoryOnPrisma } from './infrastructure/repository/user_repository'
import { postSerializer } from './infrastructure/serializer/post_serializer'
import { userSerializer } from './infrastructure/serializer/user_serializer'

export const init = () =>
  performOn(
    Container.getInstance(),
    (c) => c.register(Logger),
    (c) => c.register(PrismaClient),
    (c) => c.register(PostQuery, c.resolve(PrismaClient)),
    (c) => c.register(PostRepositoryOnPrisma, c.resolve(PrismaClient), postSerializer),
    (c) => c.register(UserRepositoryOnPrisma, c.resolve(PrismaClient), userSerializer),
    (c) => c.register(CreatePostUseCase, c.resolve(PostRepositoryOnPrisma)),
  )
