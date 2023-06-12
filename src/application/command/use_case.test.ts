import { container } from '../../container'
import { Result } from '../../core/result'
import { AnyType } from '../../lib/type'
import { User, UserIdType } from '../../model/user/user'
import { UserRepositoryOnPrisma } from '../../repository/user_repository'
import { withAuthor } from './use_case'

jest.mock('../../repository/user_repository', () => {
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
      expect(result.when({ ok: () => 'ok', err: () => 'err' })).toBe('err')
    })

    it('authorIdが存在するなら、usecase.executeを実行する', async () => {
      const usecase = {
        execute: () => Promise.resolve(Result.ok({ value: '111111111' })),
      }

      const result = await withAuthor(usecase)({
        authorId: 'test' as UserIdType,
        input: {},
      })
      expect(result.when({ ok: () => 'ok', err: () => 'err' })).toBe('ok')
    })
  })
})
