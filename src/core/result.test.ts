import { Result } from './result'

describe('Result', () => {
  describe('ok', () => {
    it('should construct a successful result', () => {
      const result = Result.ok('test')
      expect(
        result.when({
          ok: (value) => value,
          err: (error) => error.message,
        }),
      ).toBe('test')
    })

    it('should handle different types of values', () => {
      const numberResult = Result.ok(123)
      expect(
        numberResult.when({
          ok: (value) => value.toString(),
          err: (error) => error.message,
        }),
      ).toBe('123')

      const objectResult = Result.ok({ foo: 'bar' })
      expect(
        objectResult.when({
          ok: (value) => value.foo,
          err: (error) => error.message,
        }),
      ).toBe('bar')
    })
  })

  describe('error', () => {
    it('should construct a failed result', () => {
      const error = new Error('test error')
      const result = Result.error(error)
      expect(
        result.when({
          ok: (value) => value,
          err: (error) => error.message,
        }),
      ).toBe('test error')
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
          err: (error) => error.message,
        }),
      ).toBe('This is a custom error')
    })
  })

  describe('when', () => {
    it('should apply the correct handler based on the result state', () => {
      const okResult = Result.ok('test')
      const errResult = Result.error(new Error('test error'))

      expect(
        okResult.when({
          ok: (value) => `ok: ${value}`,
          err: (error) => `error: ${error.message}`,
        }),
      ).toBe('ok: test')

      expect(
        errResult.when({
          ok: (value) => `ok: ${value}`,
          err: (error) => `error: ${error.message}`,
        }),
      ).toBe('error: test error')
    })

    it('should return the correct type based on the handler', () => {
      const okResult = Result.ok(123)
      const transformedResult = okResult.when({
        ok: (value) => value * 2,
        err: (error) => error.message.length,
      })

      expect(transformedResult).toBe(246)
    })
  })

  describe('flatMap', () => {
    it('should apply the function and return a new Result if the original Result is successful', () => {
      const result = Result.ok(5)
      const doubledResult = result.flatMap((value) => Result.ok(value * 2))

      expect(
        doubledResult.when({
          ok: (value) => value.toString(),
          err: (error) => error.message,
        }),
      ).toBe('10')
    })

    it('should return the original Result if the original Result is an error', () => {
      const error = new Error('original error')
      const result = Result.error(error)
      const doubledResult = result.flatMap((value) => Result.ok(value * 2))

      expect(
        doubledResult.when({
          ok: (value) => value.toString(),
          err: (error) => error.message,
        }),
      ).toBe('original error')
    })

    it('should handle a function that returns a Result.error', () => {
      const result = Result.ok(5)
      const errorResult = result.flatMap(() => Result.error(new Error('new error')))

      expect(
        errorResult.when({
          ok: (value) => value,
          err: (error) => error.message,
        }),
      ).toBe('new error')
    })
  })
})
