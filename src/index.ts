import { CreatePostUseCase } from './application/command/create_post_use_case';
import { PostQuery } from './application/query/post_query';
import { container } from './container';
import { UserIdType } from './model/user/base_user';
import { User } from './model/user/user';

(async () => {
  const d = await container.resolve<CreatePostUseCase>('CreatePostUseCase').execute({
    context: {
      user: User.of({
        id: '5b4d1511-6915-4040-bad1-1b212bb7a637' as UserIdType,
        name: 'test',
      }),
    },
    input: { title: 'test', content: 'test' },
  });

  console.log(d);

  const q = await container
    .resolve<PostQuery>('PostQuery')
    .listByAuthorId('5b4d1511-6915-4040-bad1-1b212bb7a637' as UserIdType);
  console.log(q);
})();
