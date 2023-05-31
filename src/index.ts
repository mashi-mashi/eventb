import { match, P } from 'ts-pattern';
import { JsonType } from './core/serializable';
import { Post, PublishedPost } from './model/post';
import { PostSerializer, createPost } from './repository/post_repository';

(async () => {
  const postSerializer = (post: Post | PublishedPost) =>
    ({
      serialize() {
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          publishedDate: post.publishedDate,
        } as JsonType<Post>;
      },
      serializeEvents() {
        return post.events.map((event) => {
          return JSON.parse(JSON.stringify(event));
        });
      },
      callback() {
        return post.clearEvents();
      },
    } as PostSerializer);

  const s = await createPost(
    {
      store: async (any) => {
        console.log('stored!', any);
      },
    },
    postSerializer(
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
        .publish(new Date()),
    ),
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
