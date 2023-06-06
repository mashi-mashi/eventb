import { PrismaClient } from '@prisma/client';
import { CreatePostUseCase } from './application/command/create_post_use_case';
import { PostQuery } from './application/query/post_query';
import { AnyType } from './lib/type';
import { PostRepositoryOnPrisma } from './repository/post_repository';
import { postSerializer } from './serializer/post_serializer';

type Token<T = AnyType> = { new (...args: AnyType[]): T };

export class Container {
  private static instance: Container;
  private services = new Map();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public register<T>(token: Token<T>, ...args: ConstructorParameters<Token<T>>): Container {
    if (this.services.has(token)) {
      throw new Error(`Token ${token} is already registered`);
    }
    this.services.set(token, new token(...args));
    return this;
  }

  resolve<T>(token: Token<T>): T {
    if (!this.services.has(token)) {
      throw new Error(`Token ${token} is not registered`);
    }
    return this.services.get(token) as T;
  }
}

const container = Container.getInstance();

container
  .register(PrismaClient)
  .register(PostRepositoryOnPrisma, container.resolve(PrismaClient), postSerializer)
  .register(CreatePostUseCase, container.resolve(PostRepositoryOnPrisma))
  .register(PostQuery, container.resolve(PrismaClient));

export { container };
