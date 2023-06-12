import { EventType } from '../../core/event'

type PostCreatedEvent = {
  type: 'PostCreatedEvent'

  payload: {
    title: string
    content: string
  }
} & EventType

type PostUpdatedEvent = {
  type: 'PostUpdatedEvent'

  payload: {
    title?: string
    content?: string
  }
} & EventType

type PostPublishedEvent = {
  type: 'PostPublishedEvent'

  payload: {
    publishedAt: Date
  }
} & EventType

type PostUnPublishedEvent = {
  type: 'PostUnPublishedEvent'
} & EventType

type PostEvent = PostCreatedEvent | PostUpdatedEvent | PostPublishedEvent | PostUnPublishedEvent

type PublishedPostEvent = PostEvent

export { PostEvent, PublishedPostEvent }
