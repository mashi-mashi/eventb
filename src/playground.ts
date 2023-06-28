// import { Container } from './container'

import { Container } from './container'
import { Logger } from './core/logger'
import { init } from './init'

const main = async () => {
  init()
  // const asyncFuncs = [
  //   () => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         console.log('call 0')
  //         resolve(undefined)
  //       }, 3000)
  //     })
  //   },
  //   () => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         console.log('call 1')
  //         resolve(undefined)
  //       }, 2000)
  //     })
  //   },
  //   () => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         console.log('call 2')
  //         resolve(undefined)
  //       }, 1000)
  //     })
  //   },
  // ]

  // await runInSeries(asyncFuncs as any)
  // console.log('---')

  // await Promise.all(asyncFuncs.map((func) => func()))

  // const repo = new BiTemporalArticleRepository(new PrismaClient())
  // const validFrom = new Date()
  // validFrom.setDate(validFrom.getDate() + 10)
  // const validTo = new Date()
  // validTo.setDate(validTo.getDate() + 100)
  // await repo.store({
  //   id: 'id',
  //   title: 'title2',
  //   content: 'content2',
  //   validFrom: validFrom,
  //   validTo: validTo,
  // })

  const logger = Container.getInstance().resolve(Logger)

  logger.info('message', { a: 'a' })
  logger.warn('message', { a: 'a' })
}

main()
