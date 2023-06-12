import { Result } from './result'

describe('Result', () => {
  describe('ok', () => {
    it('should construct a successful result', () => {
      const result = Result.ok('test')
      expect(
        result.when({
          ok: (value) => value,
          error: (e) => e,
        }),
      ).toEqual('test')
    })

    it('should handle different types of values', () => {
      const numberResult = Result.ok(123)
      expect(
        numberResult.when({
          ok: (value) => value,
          error: (e) => e,
        }),
      ).toEqual(123)

      const objectResult = Result.ok({ foo: 'bar' })
      expect(
        objectResult.when({
          ok: (value) => value.foo,
          error: (e) => e,
        }),
      ).toEqual('bar')
    })
  })

  describe('error', () => {
    it('should construct a failed result', () => {
      const error = new Error('test error')
      const result = Result.error(error)
      expect(
        result.when({
          ok: (value) => value,
          error: (e) => e,
        }),
      ).toEqual(error)
    })

    it('should handle different types of errors', () => {
      class CustomError extends Error {
        constructor() {
          super('This is a custom error')
        }
      }

      const customErrResult = Result.error(new CustomError())
      expect(
        customErrResult.when({
          ok: (value) => value,
          error: (e) => e,
        }),
      ).toEqual(new CustomError())
    })
  })

  describe('wrap', () => {
    it('関数が成功した場合、Result.okを返す', () => {
      const result = Result.wrap(() => 'test')
      expect(
        result.when({
          ok: (value) => value,
          error: (e) => e,
        }),
      ).toEqual('test')
    })

    it('関数が失敗した場合、Result.errを返す', () => {
      const result = Result.wrap(() => {
        throw new Error('test error')
      })
      expect(
        result.when({
          ok: (value) => value,
          error: () => 'test error',
        }),
      ).toEqual('test error')
    })

    it('チェインできる', () => {
      const result = Result.wrap(() => 1)
        .flatMap((v) => Result.wrap(() => v + 1))
        .flatMap((v) => Result.wrap(() => v + 1))
        .flatMap((v) => Result.wrap(() => v + 1))

      expect(
        result.when({
          ok: (value) => value,
          error: (e) => e,
        }),
      ).toEqual(4)
    })
  })

  describe('asyncWrap', () => {
    it('関数が成功した場合、Result.okを返す', async () => {
      const result = await Result.asyncWrap(async () => 'async test')
      expect(
        result.when({
          ok: (value) => value,
          error: (e) => e,
        }),
      ).toEqual('async test')
    })
  })

  describe('when', () => {
    it('結果の状態に応じて、正しいハンドラを適用する', () => {
      const okResult = Result.ok('test')
      const errResult = Result.error(new Error('test error'))

      expect(
        okResult.when({
          ok: (value) => `ok: ${value}`,
          error: (e) => e,
        }),
      ).toEqual('ok: test')

      expect(
        errResult.when({
          ok: (value) => `ok: ${value}`,
          error: (e) => e,
        }),
      ).toEqual(new Error('test error'))
    })

    it('エラーハンドラは自由な型を返却できる', () => {
      const errorResult = Result.error(new Error()).when({
        ok: (value) => value * 2,
        error: () => 'error happend!',
      })

      expect(errorResult).toEqual('error happend!')
    })

    describe('okハンドラはfalsyな値を返却できる', () => {
      it('0', () => {
        const transformedResult = Result.ok(0).when({
          ok: (value) => value,
          error: (e) => e,
        })

        expect(transformedResult).toEqual(0)
      })

      it('false', () => {
        const transformedResult = Result.ok(false).when({
          ok: (value) => value,
          error: (e) => e,
        })

        expect(transformedResult).toEqual(false)
      })

      it('null', () => {
        const transformedResult = Result.ok(null).when({
          ok: (value) => value,
          error: (e) => e,
        })

        expect(transformedResult).toEqual(null)
      })
    })

    it('返却する値が undefined の場合はエラー', () => {
      const transformedResult = Result.ok(undefined).when({
        ok: (value) => value,
        error: (error) => error,
      })

      expect(transformedResult).toEqual(new Error('payload is undefined'))
    })
  })

  describe('map', () => {
    it('関数を適用し、元のResultが成功した場合、新しいResultを返す', () => {
      const result = Result.ok(5)
        .map((value) => value * 2)
        .map((value) => value * 2)
        .map((value) => value * 2)

      expect(
        result.when({
          ok: (value) => value,
          error: (error) => error,
        }),
      ).toEqual(40)
    })

    it('例外をラップしない', () => {
      const throwfunc = () => {
        throw new Error('map test error')
      }

      const throwResult = () =>
        Result.ok(5)
          .map((value) => value * 2)
          .map(() => throwfunc())
          .map((value) => value * 2)

      expect(throwResult).toThrow('map test error')
    })
  })

  describe('flatMap', () => {
    it('関数を適用し、元のResultが成功した場合、新しいResultを返す', () => {
      const doubledResult = Result.ok(5).flatMap((value) => Result.ok(value * 2))

      expect(
        doubledResult.when({
          ok: (value) => value,
          error: (error) => error,
        }),
      ).toEqual(10)
    })

    it('多重にチェインできる', () => {
      const result = Result.ok(5)
        .flatMap((value) => Result.ok(value * 2)) // 10
        .flatMap((value) => Result.ok(value * 2)) // 20
        .flatMap((value) => Result.ok(value * 2)) // 40
        .flatMap((value) => Result.ok(value * 2)) // 80

      expect(
        result.when({
          ok: (value) => value,
          error: (error) => error,
        }),
      ).toEqual(80)
    })

    it('多重にチェインできる、途中で構造を変えても型推論される', () => {
      const result = Result.ok(5)
      expect(
        result.when({
          ok: (value) => value,
          error: (error) => error,
        }),
      ).toEqual(5)

      const result2 = result.flatMap(Result.ok).flatMap(() => Result.ok('ok'))

      expect(
        result2.when({
          ok: (value) => value,
          error: (error) => error,
        }),
      ).toEqual('ok')

      const result3 = result2
        .flatMap(() => Result.ok([1, 2, 3]))
        .flatMap((r) => Result.ok(r.reduce((acc, cur) => acc + cur, 0)))

      expect(
        result3.when({
          ok: (value) => value,
          error: (error) => error,
        }),
      ).toEqual(6)
    })

    it('途中で例外が発生しても、Resultでラップする', () => {
      const result = Result.ok(5)
        .flatMap(Result.ok)
        .flatMap(Result.ok)
        .flatMap(() => Result.error(new Error('error!')))
        .flatMap(Result.ok)
        .flatMap(() => Result.ok(0))

      expect(
        result.when({
          ok: (value) => value,
          error: (error) => error,
        }),
      ).toEqual(new Error('error!'))
    })

    it('should return the original Result if the original Result is an error', () => {
      const error = new Error('original error')
      const result = Result.error(error)
      const doubledResult = result.flatMap((value) => Result.ok(value * 2))

      expect(
        doubledResult.when({
          ok: (value) => value,
          error: (error) => error,
        }),
      ).toEqual(new Error('original error'))
    })

    it('should handle a function that returns a Result.error', () => {
      const result = Result.ok(5)
      const errorResult = result.flatMap(() => Result.error(new Error('new error')))

      expect(
        errorResult.when({
          ok: (value) => value,
          error: (error) => error,
        }),
      ).toEqual(new Error('new error'))
    })
  })
})
