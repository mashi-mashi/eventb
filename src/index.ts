import { PrismaClient } from '@prisma/client';
import { Post } from './model/post/post';
import { UserIdType } from './model/user/base_user';
import { PostRepositoryOnPrisma } from './repository/post_repository';
import { postSerializer } from './serializer/post_serializer';

(async () => {
  const prisma = new PrismaClient();
  const postRepository = new PostRepositoryOnPrisma(prisma, postSerializer);

  const w = await postRepository.store(
    Post.create({
      authorId: '8e897d73-e0dd-466a-bb15-b2505c9b6cb4' as UserIdType,
      title: 'test',
      content: 'test',
    }),
  );

  console.log(w);
})();
