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
  payload: {
    postId: string;
  };
};

class Post {
  public readonly id: string;

  private constructor(public readonly title: string, public readonly content: string) {
    this.id = generateId();
  }

  private copyWith(post: Partial<Post>) {
    return new Post(post.title || this.title, post.content || this.content);
  }

  applyEvent(event: PostEvent): Post {
    switch (event.type) {
      case 'PostCreatedEvent': {
        const createdEvent = { ...event } as PostCreatedEvent;
        return this.copyWith({
          title: createdEvent.payload.title,
          content: createdEvent.payload.content,
        });
      }
      case 'PostUpdatedvent': {
        const updatedEvent = event as PostUpdatedEvent;
        return this.copyWith({
          title: updatedEvent.payload.title,
          content: updatedEvent.payload.content,
        });
      }
      case 'PostPublishedEvent': {
        return this.copyWith({});
      }
    }
  }
}

export { Post };
