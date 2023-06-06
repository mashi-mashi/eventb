import { PrismaClient } from '@prisma/client';
import { CreatePostUseCase } from './application/command/create_post_use_case';
import { PostQuery } from './application/query/post_query';
import { AnyType } from './lib/type';
import { PostRepositoryOnPrisma } from './repository/post_repository';
import { postSerializer } from './serializer/post_serializer';

type Token<T extends new (...args: AnyType[]) => AnyType> = T;

export class Container {
  private static instance: Container;
  private services = new Map<Token<AnyType>, AnyType>();

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public register<T extends new (...args: AnyType[]) => AnyType>(
    token: Token<T>,
    ...args: ConstructorParameters<T>
  ): Container {
    if (this.services.has(token)) {
      throw new Error(`Token ${token} is already registered`);
    }
    this.services.set(token, new token(...args));
    return this;
  }

  resolve<T extends new (...args: AnyType[]) => AnyType>(token: Token<T>): InstanceType<T> {
    if (!this.services.has(token)) {
      throw new Error(`Token ${token} is not registered`);
    }
    return this.services.get(token) as InstanceType<T>;
  }
}

const container = Container.getInstance();

container
  .register(PrismaClient)
  .register(PostRepositoryOnPrisma, container.resolve(PrismaClient), postSerializer)
  .register(CreatePostUseCase, container.resolve(PostRepositoryOnPrisma))
  .register(PostQuery, container.resolve(PrismaClient));

export { container };
