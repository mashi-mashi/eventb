import { UserIdType } from '../model/user/base_user';
import { User } from '../model/user/user';
import { CreatePostUseCase } from './create_post_use_case';
import { storePost } from '../repository/post_repository';

describe('CreatePostUseCase', () => {
  const usecase = new CreatePostUseCase(storePost);

  describe('execute', () => {
    it('idが入っていなければResult.errorを返す', async () => {
      const result = await usecase.execute({ context: {}, input: { title: 'test', content: 'test' } });
      expect(
        result.when({
          ok: (value) => {
            return { value, message: 'ok' };
          },
          err: (error) => ({ message: error.message }),
        }).message,
      ).toBe('User is not logged in.');
    });

    it('記事の作成に成功する', async () => {
      const result = await usecase.execute({
        context: {
          user: User.of({ id: 'author' as UserIdType, name: 'author' }),
        },
        input: { title: 'test', content: 'test' },
      });
      expect(
        result.when({
          ok: (value) => {
            return { value, message: 'ok' };
          },
          err: (error) => ({ message: error.message }),
        }).message,
      ).toBe('ok');
    });

    it('Repositoryが例外を返したときは、Result.errorを返す', async () => {
      const result = await new CreatePostUseCase(() => Promise.reject(new Error('Repository error'))).execute({
        context: {
          user: User.of({ id: 'author' as UserIdType, name: 'author' }),
        },
        input: { title: 'test', content: 'test' },
      });
      expect(
        result.when({
          ok: (value) => {
            return { value, message: 'ok' };
          },
          err: (error) => ({ message: error.message }),
        }).message,
      ).toBe('Repository error');
    });
  });
});
