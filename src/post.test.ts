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
  });

  test('イベントを介してUpdateできる', () => {
    const post = Post.create({
      type: 'PostCreatedEvent',
      payload: {
        title: 'title',
        content: 'content',
      },
    }).applyEvent({
      type: 'PostUpdatedvent',
      payload: {
        title: 'new title',
      },
    });
    expect(post.title).toBe('new title');
    expect(post.content).toBe('content');
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
        type: 'PostUpdatedvent',
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
  });
});
