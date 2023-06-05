import { match } from 'ts-pattern';

export class Result<T, E extends Error> {
  private constructor(private readonly ok: boolean, private readonly value?: T, private readonly error?: E) {}

  static ok<T>(value: T): Result<T, Error> {
    return new Result(true, value);
  }

  static error<E extends Error>(error: E): Result<never, E> {
    return new Result(false, undefined as never, error);
  }

  static wrap<T>(f: () => T): Result<T, Error> {
    try {
      return Result.ok(f());
    } catch (e) {
      return Result.error(e as Error);
    }
  }

  static async asyncWrap<T>(f: () => Promise<T>): Promise<Result<T, Error>> {
    try {
      return Result.ok(await f());
    } catch (e) {
      return Result.error(e as Error);
    }
  }

  when<U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): U {
    return match({ kind: this.ok ? ('ok' as const) : ('err' as const), payload: this.ok ? this.value : this.error })
      .with({ kind: 'ok' }, ({ payload }) =>
        // TODO: undefined はありえないはずなので、うまくパターンマッチしたい
        payload ? handlers.ok(payload as T) : handlers.err(Result.error(new Error('payload is undefined.')).error as E),
      )
      .with({ kind: 'err' }, ({ payload }) =>
        handlers.err((payload ?? Result.error(new Error('payload is undefined.')).error) as E),
      )
      .exhaustive();
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this.ok ? fn(this.value as T) : Result.error(this.error as E);
  }
}
