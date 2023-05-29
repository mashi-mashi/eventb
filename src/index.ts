import { Post } from './model/post';
import { createPost } from './repository/post_repository';

(() => {
  const postSerializer = (post: Post) => ({
    serialize() {
      return {
        id: post.id,
      };
    },
    serializeEvents() {
      return post.events.map((event) => {
        return {
          type: event.type,
        };
      });
    },
  });
  createPost(
    {
      store: (any: unknown) => {
        console.log('stored!', any);
      },
    },
    postSerializer(Post.create({ title: 'title', content: 'content' })),
  );
})();
