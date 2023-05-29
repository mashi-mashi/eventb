import { Post } from './post';

describe('Post', () => {
  test('初期化できる', () => {
    const post = Post.create({
      type: 'PostCreatedEvent',
      payload: {
        title: 'title',
        content: 'content',
      },
    });
    expect(post.title).toBe('title');
    expect(post.content).toBe('content');
    expect(post.events.length).toBe(1);
    expect(post.lastEvent.type).toBe('PostCreatedEvent');
  });

  test('イベントを介してUpdateできる', () => {
    const post = Post.create({
      type: 'PostCreatedEvent',
      payload: {
        title: 'title',
        content: 'content',
      },
    }).applyEvent({
      type: 'PostUpdatedEvent',
      payload: {
        title: 'new title',
      },
    });
    expect(post.title).toBe('new title');
    expect(post.content).toBe('content');
    expect(post.events.length).toBe(2);
    expect(post.lastEvent.type).toBe('PostUpdatedEvent');
  });

  test('イベントを介してPublishできる', () => {
    const post = Post.create({
      type: 'PostCreatedEvent',
      payload: {
        title: 'title',
        content: 'content',
      },
    })
      .applyEvent({
        type: 'PostUpdatedEvent',
        payload: {
          title: 'new title',
        },
      })
      .applyEvent({
        type: 'PostPublishedEvent',
      });
    expect(post.title).toBe('new title');
    expect(post.content).toBe('content');
    expect(post.publishedDate).toBeDefined();
    expect(post.events.length).toBe(3);
    expect(post.lastEvent.type).toBe('PostPublishedEvent');
  });
});
