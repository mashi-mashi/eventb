import { match } from 'ts-pattern';
import { Result } from '../../core/result';
import { performOn } from '../../lib/util';
import { BasePost } from '../../model/post/base_post';
import { Post } from '../../model/post/post';
import { PublishedPost } from '../../model/post/published_post';
import { PostRepositoryType } from '../../repository/post_repository';
import { ContextType, UseCaseType } from './use_case';

export class CreatePostUseCase implements UseCaseType<{ title: string; content: string }, BasePost> {
  constructor(private readonly postRepository: PostRepositoryType) {}

  async execute({ context, input }: { context: ContextType; input: { title: string; content: string } }) {
    return Result.asyncWrap(() => {
      if (!context.user) throw new Error('User is not logged in.');

      const created = context.user.performAction((user) => {
        return performOn<Post | PublishedPost>(
          Post.create({ authorId: user.id, title: input.title, content: input.content }),
          (p0) =>
            match(p0)
              .with({ kind: 'Post' }, (p) => p.publish(new Date()))
              .with({ kind: 'PublishedPost' }, (p) => p)
              .exhaustive(),
        );

        // return Post.create({ authorId: user.id, title: input.title, content: input.content });
      });

      return this.postRepository.store(created);
    });
  }
}
