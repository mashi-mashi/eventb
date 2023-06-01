import { match } from 'ts-pattern';
import { Post } from './model/post';
import { createPost } from './repository/post_repository';
import { postSerializer } from './serializer/post_serializer';

(async () => {
  const s = await createPost(
    {
      store: async (any) => {
        console.log('stored!', any);
        return Promise.resolve();
      },
      get: async (id) => {
        throw new Error(`not implemented! ${id}`);
      },
    },
    postSerializer,
    Post.create({ title: 'title', content: 'content' })
      .update({
        title: 'new title1',
      })
      .update({
        title: 'new title2',
      })
      .update({
        title: 'new title3',
      })
      .update({
        title: 'new title4',
      })
      .publish(new Date())
      .unpublish(),
  );

  match(s)
    .with({ kind: 'Post' }, (post) => {
      console.log('post', post);
    })
    .with({ kind: 'PublishedPost' }, (publishedPost) => {
      console.log('PublishedPost!!!!!!!', publishedPost);
    })
    .exhaustive();
})();
