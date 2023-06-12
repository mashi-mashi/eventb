import { filteredUndefined, performOn, pipe } from './util'

describe('filteredUndefined', () => {
  it('should filter out undefined values', () => {
    const array = [1, 2, undefined, 3, undefined, 4]
    expect(filteredUndefined(array)).toEqual([1, 2, 3, 4])
  })
})

describe('pipe', () => {
  it('should pipe functions', () => {
    const add = (x: number) => x + 1
    const multiply = (x: number) => x * 2
    const subtract = (x: number) => x - 3
    const result = pipe(add, multiply, subtract)(1)
    expect(result).toBe(1)
  })
})

describe('perfomOn', () => {
  it('should perform functions', () => {
    const add = (x: number) => x + 1
    const multiply = (x: number) => x * 2
    const subtract = (x: number) => x - 3
    const result = performOn(1, add, multiply, subtract)
    expect(result).toBe(1)
  })

  it('should perform functions', () => {
    const result = performOn(
      'hoge',
      (s) => s + 'fuga',
      (s) => s + 'piyo',
    )
    expect(result).toBe('hogefugapiyo')
  })

  it('should perform functions', () => {
    const result = performOn(
      'hoge',
      () => '',
      () => '',
      () => '',
      () => 'fuga',
    )
    expect(result).toBe('fuga')
  })

  it('should perform async functions', async () => {
    const result = await performOn(
      Promise.resolve('hoge'),
      async () => 'test1',
      async () => 'test2',
    )
    expect(result).toBe('test2')
  })
})
