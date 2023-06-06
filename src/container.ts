import { PrismaClient } from '@prisma/client';
import { AnyType } from './lib/type';
import { PostRepositoryOnPrisma, PostRepositoryType } from './repository/post_repository';
import { postSerializer } from './serializer/post_serializer';
import { CreatePostUseCase } from './application/command/create_post_use_case';
import { PostQuery } from './application/query/post_query';

interface Constructor<T> {
  new (...args: AnyType[]): T;
}

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

  public register<T>(token: string, constructor: Constructor<T>, ...args: AnyType[]): void {
    if (this.services.has(token)) {
      throw new Error(`Token ${token} is already registered`);
    }
    this.services.set(token, new constructor(...args));
  }

  public resolve<T>(token: string): T {
    if (!this.services.has(token)) {
      throw new Error(`Token ${token} is not registered`);
    }
    return this.services.get(token) as T;
  }
}

const container = Container.getInstance();

container.register('Prisma', PrismaClient);
container.register('PostRepository', PostRepositoryOnPrisma, container.resolve<PrismaClient>('Prisma'), postSerializer);
container.register('CreatePostUseCase', CreatePostUseCase, container.resolve<PostRepositoryType>('PostRepository'));
container.register('PostQuery', PostQuery, container.resolve<PrismaClient>('Prisma'));

export { container };
