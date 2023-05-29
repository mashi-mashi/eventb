import { generateId } from './uuid';

class Post {
  public readonly id: string;

  constructor(public readonly title: string, public readonly content: string) {
    this.id = generateId();
  }
}

export { Post };
