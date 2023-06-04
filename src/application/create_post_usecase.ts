import { Post } from '../model/post/post';
import { createPost } from '../repository/post_repository';

export class CreatePostUseCase {
  async execute(request: { title: string; content: string }) {
    // const created = Post.create({ title: request.title, content: request.content });
    // return await createPost(created);
  }
}
