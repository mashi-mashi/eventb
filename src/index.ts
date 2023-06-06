import { container } from './container';
import { PostIdType } from './model/post/base_post';
import { PostRepositoryType } from './repository/post_repository';

(async () => {
  const w = await container
    .resolve<PostRepositoryType>('PostRepository')
    .get('ff50398e-168d-436f-b637-d3435aea2c44' as PostIdType);

  console.log(w);
})();
