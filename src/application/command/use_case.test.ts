import { container } from '../../container'
import { Result } from '../../core/result'
import { AnyType } from '../../core/type'
import { UserRepositoryOnPrisma } from '../../infrastructure/repository/user_repository'
import { User, UserIdType } from '../../model/user/user'
import { withAuthor } from './use_case'

jest.mock('../../infrastructure/repository/user_repository', () => {
  return {
    UserRepositoryOnPrisma: jest.fn().mockImplementation(() => {
      return {
        get: (id: UserIdType) => User.of({ id, name: 'test' }),
        store: jest.fn(),
      }
    }),
  }
})

describe('UseCase', () => {
  beforeEach(() => {
    container.reset()
    container.register(UserRepositoryOnPrisma, {} as AnyType, {} as AnyType)
  })

  // テストが終わるたびに実行
  afterEach(() => {
    container.reset()
  })

  describe('withAuthor', () => {
    it('authorIdがundefinedならエラーを返す', async () => {
      const usecase = {
        execute: jest.fn(),
      }

      const result = await withAuthor(usecase)({
        input: {},
      })
      expect(result.when({ ok: () => 'ok', error: (e) => e })).toEqual(
        new Error('authorId is undefined'),
      )
    })

    it('authorIdが存在するなら、usecase.executeを実行する', async () => {
      const usecase = {
        execute: () => Promise.resolve(Result.ok({ value: '111111111' })),
      }

      const result = await withAuthor(usecase)({
        authorId: 'test' as UserIdType,
        input: {},
      })
      expect(result.when({ ok: () => 'ok', error: (e) => e })).toEqual('ok')
    })
  })
})
