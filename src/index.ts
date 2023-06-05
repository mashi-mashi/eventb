import { CreatePostUseCase } from './application/create_post_use_case';
import { withAuthor } from './application/use_case';
import { storePost } from './repository/post_repository';

(async () => {
  await withAuthor(
    {},
    new CreatePostUseCase(storePost),
  )({ title: 'title', content: 'content' }).then((result) => {
    console.log(
      'CreatePostUseCase',
      result.when({
        ok: (value) => {
          return { value, message: 'ok' };
        },
        err: (error) => ({ message: error.message }),
      }),
    );
  });
})();
