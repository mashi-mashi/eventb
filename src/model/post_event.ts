import { EventType } from '../core/event';

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

type PostEvent = PostCreatedEvent | PostUpdatedEvent | PostPublishedEvent;

export { PostEvent };
