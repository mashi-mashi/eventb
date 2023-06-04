import { match } from 'ts-pattern';
import { createPost } from './repository/post_repository';
import { Post } from './model/post/post';

(async () => {
  const s = await createPost(
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
      Post.of(post).lastEvent?.type;
    })
    .with({ kind: 'PublishedPost' }, (publishedPost) => {
      console.log('PublishedPost!!!!!!!', publishedPost);
    })
    .exhaustive();
})();
