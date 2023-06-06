import { EventType } from '../../core/event';

type PostCreatedEvent = {
  type: 'PostCreatedEvent';

  payload: {
    title: string;
    content: string;
  };
} & EventType;

type PostUpdatedEvent = {
  type: 'PostUpdatedEvent';
  payload: {
    title?: string;
    content?: string;
  };
} & EventType;

type PostPublishedEvent = {
  type: 'PostPublishedEvent';
  payload: {
    publishedDate: Date;
  };
} & EventType;

type PostEvent = PostCreatedEvent | PostUpdatedEvent | PostPublishedEvent | PostUnPublishedEvent;

type PostUnPublishedEvent = {
  type: 'PostUnPublishedEvent';
} & EventType;

type PublishedPostEvent = PostEvent;

export { PostEvent, PublishedPostEvent };
