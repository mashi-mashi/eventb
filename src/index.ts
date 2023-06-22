import Fastify, { FastifyInstance } from 'fastify'
import { CreatePostUseCase } from './application/command/create_post_use_case'
import { withAuthor } from './application/command/use_case'
import { container } from './container'
import { UserIdType } from './model/user/user'

const withAuhorCreatePost = withAuthor(container.resolve(CreatePostUseCase))
const server: FastifyInstance = Fastify({ logger: true })

server.get(
  '/ping',
  {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            pong: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  async () => {
    return { pong: 'it worked!' }
  },
)

server.get(
  '/posts/:id',
  {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            value: {
              type: 'object',
              additionalProperties: true, // なんでもありになるので注意
            },
            error: {
              type: 'object',
              additionalProperties: true, // なんでもありになるので注意
            },
          },
        },
      },
    },
  },
  async (req, reply) => {
    const d = await withAuhorCreatePost({
      authorId: '5b4d1511-6915-4040-bad1-1b212bb7a6371' as UserIdType,
      //authorId: '5b4d1511-6915-4040-bad1-1b212bb7a637' as UserIdType,
      input: {
        title: 'test',
        content: 'test',
      },
    })
    return d.when({
      ok: (v) => {
        return reply.status(200).send({
          ok: true,
          value: v,
        })
      },
      error: (e) => {
        server.log.error(e)
        return reply.status(500).send({ ok: false, error: { message: e.message } })
      },
    })
  },
)

const start = async () => {
  try {
    await server.listen({ port: 3000 })

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port
    console.log(`server listening on ${port}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
