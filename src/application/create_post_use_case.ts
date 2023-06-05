import { Result } from '../core/result';
import { BasePost } from '../model/post/base_post';
import { Post } from '../model/post/post';
import { UseCaseType, ContextType } from './use_case';

export class CreatePostUseCase implements UseCaseType<{ title: string; content: string }, BasePost> {
  constructor(private readonly storePost: (post: Post) => Promise<BasePost>) {}

  async execute({ context, input }: { context: ContextType; input: { title: string; content: string } }) {
    return Result.asyncWrap(() => {
      if (!context.user?.id) throw new Error('User is not logged in.');
      const created = Post.create({ authorId: context.user.id, title: input.title, content: input.content });
      return this.storePost(created);
    });
  }
}
