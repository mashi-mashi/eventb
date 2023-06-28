import { match } from 'ts-pattern'
import { Result } from '../../core/result'
import { performOn } from '../../core/util'
import { PostRepositoryOnPrisma } from '../../infrastructure/repository/post_repository'
import { BasePost } from '../../model/post/base_post'
import { Post } from '../../model/post/post'
import { PublishedPost } from '../../model/post/published_post'
import { ContextType, UseCaseType } from './use_case'

export class CreatePostUseCase
  implements UseCaseType<{ title: string; content: string }, BasePost>
{
  constructor(private readonly postRepository: PostRepositoryOnPrisma) {}

  async execute({
    context,
    input,
  }: {
    context: ContextType
    input: { title: string; content: string }
  }) {
    return Result.asyncWrap(async () => {
      if (!context.user) throw new Error('User is not logged in.')

      const created = context.user.performAction((u) =>
        performOn<Post | PublishedPost>(
          Post.create({ authorId: u.id, title: input.title, content: input.content }),
          (p) =>
            match(p)
              .with({ kind: 'Post' }, (post) => {
                return post.publish(new Date())
              })
              .with({ kind: 'PublishedPost' }, (publishedPost) => {
                return publishedPost
              })
              .exhaustive(),
        ),
      )

      return this.postRepository.store(created)
    })
  }
}
