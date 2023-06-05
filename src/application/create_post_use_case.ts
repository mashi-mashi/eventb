import { Result } from '../core/result';
import { AnyType } from '../lib/type';
import { BasePost } from '../model/post/base_post';
import { Post } from '../model/post/post';
import { UserIdType } from '../model/user/base_user';
import { User } from '../model/user/user';

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

type ContextType = {
  user?: User;
};

type UseCaseType<Input, Output> = {
  execute: (param: { context: ContextType; input: Input }) => Promise<Result<Output, Error>>;
};

export const withAuthor = <Input, Output>(req: AnyType, usecase: UseCaseType<Input, Output>) => {
  return async (input: Input) => {
    const context = {
      user: User.of({ id: 'author' as UserIdType, name: 'author' }),
    };

    return usecase.execute({ context, input });
  };
};
