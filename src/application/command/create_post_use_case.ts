import { Result } from '../../core/result';
import { BasePost } from '../../model/post/base_post';
import { Post } from '../../model/post/post';
import { PostRepositoryType } from '../../repository/post_repository';
import { ContextType, UseCaseType } from './use_case';

export class CreatePostUseCase implements UseCaseType<{ title: string; content: string }, BasePost> {
  constructor(private readonly postRepository: PostRepositoryType) {}

  async execute({ context, input }: { context: ContextType; input: { title: string; content: string } }) {
    return Result.asyncWrap(() => {
      if (!context.user) throw new Error('User is not logged in.');

      const created = context.user.performAction((user) =>
        Post.create({ authorId: user.id, title: input.title, content: input.content }),
      );

      return this.postRepository.store(created);
    });
  }
}
