import { generateId } from './uuid';

type PostEvent = PostCreatedEvent | PostUpdatedEvent | PostPublishedEvent;

type PostCreatedEvent = {
  type: 'PostCreatedEvent';
  payload: {
    title: string;
    content: string;
  };
};

type PostUpdatedEvent = {
  type: 'PostUpdatedvent';
  payload: {
    title?: string;
    content?: string;
  };
};

type PostPublishedEvent = {
  type: 'PostPublishedEvent';
};

class Post {
  public readonly id: string;
  public readonly publishedDate?: Date;

  private constructor(public readonly title: string, public readonly content: string, publishedDate?: Date) {
    this.id = generateId();
    this.publishedDate = publishedDate;
  }

  private copyWith(post: Partial<Post>) {
    return new Post(post.title || this.title, post.content || this.content, post.publishedDate);
  }

  static create(event: PostCreatedEvent): Post {
    return new Post(event.payload.title, event.payload.content).applyEvent(event);
  }

  applyEvent(event: PostEvent): Post {
    switch (event.type) {
      case 'PostCreatedEvent': {
        const createdEvent = event as PostCreatedEvent;
        return new Post(createdEvent.payload.title, createdEvent.payload.content);
      }
      case 'PostUpdatedvent': {
        const updatedEvent = event as PostUpdatedEvent;
        return this.copyWith({
          title: updatedEvent.payload.title,
          content: updatedEvent.payload.content,
        });
      }
      case 'PostPublishedEvent': {
        return this.copyWith({
          publishedDate: new Date(),
        });
      }
    }
  }
}

export { Post };
