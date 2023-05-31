import { Post, PublishedPost } from './post';

describe('Post', () => {
  describe('イベント', () => {
    test('初期化できる', () => {
      const post = Post.create({ title: 'title', content: 'content' });
      expect(post.title).toBe('title');
      expect(post.content).toBe('content');
      expect(post.events.length).toBe(1);
      expect(post.lastEvent.type).toBe('PostCreatedEvent');
    });

    test('イベントを介してUpdateできる', () => {
      const post = Post.create({ title: 'title', content: 'content' }).applyEvent({
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
      const post = Post.create({ title: 'title', content: 'content' })
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

    test('イベントをクリアできる', () => {
      const post = Post.create({ title: 'title', content: 'content' })
        .applyEvent({
          type: 'PostUpdatedEvent',
          payload: {
            title: 'new title',
          },
        })
        .applyEvent({
          type: 'PostPublishedEvent',
        });
      expect(post.events.length).toBe(3);
      expect(post.lastEvent.type).toBe('PostPublishedEvent');

      const clearedPost = post.clearEvents();
      expect(clearedPost.events.length).toBe(0);
    });

    test('イベント操作は全てイミュータブルな操作であること', () => {
      const post = Post.create({ title: 'title', content: 'content' });
      const updatedPost = post.update({ title: 'new title' });

      expect(post.title).toBe('title');
      expect(updatedPost.title).toBe('new title');
      expect(post).not.toBe(updatedPost);
    });
  });

  describe('操作', () => {
    test('updateイベントが発火する', () => {
      const post = Post.create({ title: 'title', content: 'content' }).update({
        title: 'new title',
      });

      expect(post.title).toBe('new title');
      expect(post.content).toBe('content');
      expect(post.events.length).toBe(2);
      expect(post.lastEvent.type).toBe('PostUpdatedEvent');
    });
  });

  test('publishイベントが発火する', () => {
    const post = Post.create({ title: 'title', content: 'content' }).publish();

    expect(post.title).toBe('title');
    expect(post.content).toBe('content');
    expect(post.events.length).toBe(2);
    expect(post.publishedDate).toBeDefined();
    expect(post.lastEvent.type).toBe('PostPublishedEvent');
  });

  test('publishした場合、PublishedPostクラスを返却する', () => {
    const post = Post.create({ title: 'title', content: 'content' }).publish();
    expect(post instanceof PublishedPost).toBeTruthy();
  });

  describe('PublishedPost Class', () => {
    test('publishDateが存在しない場合は、初期化できない', () => {
      expect(() => PublishedPost.fromPost(Post.create({ title: 'title', content: 'content' }))).toThrow(
        'Post is not published yet.',
      );
    });

    test('イベントを引き継いで初期化される', () => {
      const published = Post.create({ title: 'title', content: 'content' }).update({ title: 'new title' }).publish();

      expect(published.title).toBe('new title');
      expect(published.content).toBe('content');
      expect(published.publishedDate).toBeDefined();
      expect(published.events.length).toBe(3);
      expect(published instanceof PublishedPost).toBeTruthy();
    });

    test('unpublishメソッドを介して、Postクラスに交換できる', () => {
      const unpublished = Post.create({ title: 'title', content: 'content' })
        .update({ title: 'new title' })
        .publish()
        .unpublish();

      expect(unpublished.title).toBe('new title');
      expect(unpublished.content).toBe('content');
      expect(unpublished.publishedDate).toBeUndefined();
      expect(unpublished.events.length).toBe(4);
      expect(unpublished instanceof Post).toBeTruthy();
    });
  });
});
