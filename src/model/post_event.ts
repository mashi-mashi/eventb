import { EventType } from '../core/event';

type PostEvent = PostCreatedEvent | PostUpdatedEvent | PostPublishedEvent;

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
} & EventType;

export { PostEvent, PostCreatedEvent, PostUpdatedEvent, PostPublishedEvent };
