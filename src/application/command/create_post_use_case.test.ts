import { PostIdType } from '../../model/post/base_post'
import { Post } from '../../model/post/post'
import { User, UserIdType } from '../../model/user/user'
import { PostRepositoryType } from '../../infrastructure/repository/post_repository'
import { CreatePostUseCase } from './create_post_use_case'

const mockPostRepository: PostRepositoryType = {
  store(post) {
    console.log('stored!', post)
    return Promise.resolve(
      Post.of({
        id: 'test' as PostIdType,
        authorId: 'test' as UserIdType,
        title: 'test',
        content: 'test',
      }),
    )
  },

  get(id) {
    return Promise.resolve(
      Post.of({
        id: id,
        authorId: 'test' as UserIdType,
        title: 'test',
        content: 'test',
      }),
    )
  },
}

const mockThrowPostRepository: PostRepositoryType = {
  store() {
    return Promise.reject(new Error('Repository error'))
  },

  get() {
    return Promise.reject(new Error('Repository error'))
  },
}

describe('CreatePostUseCase', () => {
  const usecase = new CreatePostUseCase(mockPostRepository)

  describe('execute', () => {
    it('idが入っていなければResult.errorを返す', async () => {
      const result = await usecase.execute({
        context: {},
        input: { title: 'test', content: 'test' },
      })
      expect(
        result.when({
          ok: (value) => {
            return { value, message: 'ok' }
          },
          err: (error) => ({ message: error.message }),
        }).message,
      ).toBe('User is not logged in.')
    })

    it('記事の作成に成功する', async () => {
      const result = await usecase.execute({
        context: {
          user: User.of({ id: 'author' as UserIdType, name: 'author' }),
        },
        input: { title: 'test', content: 'test' },
      })
      expect(
        result.when({
          ok: (value) => {
            return { value, message: 'ok' }
          },
          err: (error) => ({ message: error.message }),
        }).message,
      ).toBe('ok')
    })

    it('Repositoryが例外を返したときは、Result.errorを返す', async () => {
      const result = await new CreatePostUseCase(mockThrowPostRepository).execute({
        context: {
          user: User.of({ id: 'author' as UserIdType, name: 'author' }),
        },
        input: { title: 'test', content: 'test' },
      })
      expect(
        result.when({
          ok: (value) => {
            return { value, message: 'ok' }
          },
          err: (error) => ({ message: error.message }),
        }).message,
      ).toBe('Repository error')
    })
  })
})
