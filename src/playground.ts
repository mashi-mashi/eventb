import { Result } from './core/result'

async function runInSeries(asyncFuncs: (() => Promise<void>)[]): Promise<void> {
  return asyncFuncs.reduce(async (prevPromise, func) => {
    await prevPromise
    return func()
  }, Promise.resolve())
}

const main = async () => {
  const asyncFuncs = [
    () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('call 0')
          resolve(undefined)
        }, 3000)
      })
    },
    () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('call 1')
          resolve(undefined)
        }, 2000)
      })
    },
    () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('call 2')
          resolve(undefined)
        }, 1000)
      })
    },
  ]

  await runInSeries(asyncFuncs as any)
  console.log('---')

  await Promise.all(asyncFuncs.map((func) => func()))
}

main()
