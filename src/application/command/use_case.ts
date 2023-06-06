import { Result } from '../../core/result';
import { AnyType } from '../../lib/type';
import { UserIdType } from '../../model/user/base_user';
import { User } from '../../model/user/user';

export type ContextType = {
  user?: User;
};

export type UseCaseType<Input, Output> = {
  execute: (param: { context: ContextType; input: Input }) => Promise<Result<Output, Error>>;
};

export const withAuthor = <Input, Output>(req: AnyType, usecase: UseCaseType<Input, Output>) => {
  return async (input: Input) => {
    return Result.asyncWrap(() => {
      if (req.authorId === undefined) throw new Error('authorId is undefined');
      const context = {
        user: User.of({ id: req.authorId as UserIdType, name: 'author' }),
      };

      return usecase.execute({ context, input });
    }).then((result) => result.flatMap((value) => value));
  };
};
