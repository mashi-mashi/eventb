import { match } from 'ts-pattern';

export class Result<T, E extends Error> {
  private constructor(private readonly ok: boolean, private readonly value?: T, private readonly error?: E) {}

  static ok<T>(value: T): Result<T, never> {
    return new Result(true, value);
  }

  static error<E extends Error>(error: E): Result<never, E> {
    return new Result(false, undefined as never, error);
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
}
