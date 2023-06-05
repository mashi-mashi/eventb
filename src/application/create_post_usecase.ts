import { AnyType } from '../lib/type';
import { BasePost } from '../model/post/base_post';
import { Post } from '../model/post/post';
import { UserIdType } from '../model/user/base_user';
import { User } from '../model/user/user';
import { createPost } from '../repository/post_repository';

export class CreatePostUseCase implements UseCaseType<{ title: string; content: string }, BasePost> {
  async execute({ context, input }: { context: ContextType; input: { title: string; content: string } }) {
    if (!context.user?.id) throw new Error('User is not logged in.');

    const created = Post.create({ authorId: context.user.id, title: input.title, content: input.content });
    return await createPost(created);
  }
}

type ContextType = {
  user?: User;
};

type UseCaseType<Input, Output> = {
  execute: (param: { context: ContextType; input: Input }) => Promise<Output>;
};

export const withAuthor = <Input, Output>(req: AnyType, usecase: UseCaseType<Input, Output>) => {
  return async (input: Input) => {
    const context = {
      user: User.of({ id: 'author' as UserIdType, name: 'author' }),
    };

    return usecase.execute({ context, input });
  };
};
