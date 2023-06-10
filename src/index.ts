import { CreatePostUseCase } from './application/command/create_post_use_case';
import { withAuthor } from './application/command/use_case';
import { container } from './container';
import { UserIdType } from './model/user/user';

const withAuhorCreatePost = withAuthor(container.resolve(CreatePostUseCase));

(async () => {
  const d = await withAuhorCreatePost({
    authorId: '5b4d1511-6915-4040-bad1-1b212bb7a637' as UserIdType,
    input: {
      title: 'test',
      content: 'test',
    },
  });

  d.when({
    ok: (v) => console.log('ok!!!!', v),
    err: (e) => console.log(e),
  });

  // const q = await container.resolve(PostQuery).listByAuthorId('5b4d1511-6915-4040-bad1-1b212bb7a637' as UserIdType);
  // console.log(q);
})();
