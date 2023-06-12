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
          ok: (value) => value.toString(),
          error: (e) => e,
        }),
      ).toEqual('123')

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
          error: (e) => e,
        }),
      ).toEqual(new Error('test error'))
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
    it('should apply the correct handler based on the result state', () => {
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

    it('should return the correct type based on the handler', () => {
      const okResult = Result.ok(123)
      const transformedResult = okResult.when({
        ok: (value) => value * 2,
        error: (error) => error,
      })

      expect(transformedResult).toEqual(246)
    })

    describe('falsyな値を返却できる', () => {
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

  describe('flatMap', () => {
    it('関数を適用し、元のResultが成功した場合、新しいResultを返す', () => {
      const doubledResult = Result.ok(5).flatMap((value) => Result.ok(value * 2))

      expect(
        doubledResult.when({
          ok: (value) => value.toString(),
          error: (error) => error,
        }),
      ).toEqual('10')
    })

    it('多重にチェインできる', () => {
      const doubledResult = Result.ok(5)
        .flatMap((v) => Result.ok(v * 2))
        .flatMap((v) => Result.ok(v * 2))
        .flatMap((v) => Result.ok(v * 2))
        .flatMap(() => Result.ok(0))

      expect(
        doubledResult.when({
          ok: (value) => value.toString(),
          error: (error) => error,
        }),
      ).toEqual('0')
    })

    it('should return the original Result if the original Result is an error', () => {
      const error = new Error('original error')
      const result = Result.error(error)
      const doubledResult = result.flatMap((value) => Result.ok(value * 2))

      expect(
        doubledResult.when({
          ok: (value) => value.toString(),
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
