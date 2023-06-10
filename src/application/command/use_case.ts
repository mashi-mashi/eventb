import { container } from '../../container';
import { Result } from '../../core/result';
import { AnyType } from '../../lib/type';
import { UserIdType } from '../../model/user/base_user';
import { User } from '../../model/user/user';
import { UserRepositoryOnPrisma } from '../../repository/user_repository';

export type ContextType = {
  user?: User;
};

export type UseCaseType<Input, Output> = {
  execute: (param: { context: ContextType; input: Input }) => Promise<Result<Output, Error>>;
};

export const withAuthor = <Input, Output>(req: AnyType, usecase: UseCaseType<Input, Output>) => {
  return async (input: Input) => {
    return Result.asyncWrap(async () => {
      if (req.authorId === undefined) throw new Error('authorId is undefined');

      const author = await container.resolve(UserRepositoryOnPrisma).get(req.authorId as UserIdType);

      if (!author) throw new Error('author is not found');

      const context = {
        user: author as User,
      };

      return usecase.execute({ context, input });
    }).then((result) => result.flatMap);
  };
};
