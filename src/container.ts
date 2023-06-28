import { AnyType } from './core/type'

type Token<T extends new (...args: AnyType[]) => AnyType> = T

export class Container {
  private static instance: Container
  public services = new Map<Token<AnyType>, AnyType>()

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container()
    }
    return Container.instance
  }

  public register<T extends new (...args: AnyType[]) => AnyType>(
    token: Token<T>,
    ...args: ConstructorParameters<T>
  ): Container {
    if (this.services.has(token)) {
      throw new Error(`Token ${token} is already registered`)
    }
    this.services.set(token, new token(...args))
    return this
  }

  resolve<T extends new (...args: AnyType[]) => AnyType>(token: Token<T>): InstanceType<T> {
    if (!this.services.has(token)) {
      throw new Error(`Token ${token} is not registered`)
    }
    return this.services.get(token) as InstanceType<T>
  }

  reset(): void {
    this.services.clear()
  }
}

// export const container2 = pipe(
//   (c: Container) => c.register(PrismaClient),
//   (c) => c.register(PostRepositoryOnPrisma, c.resolve(PrismaClient), postSerializer),
//   (c) => c.register(CreatePostUseCase, c.resolve(PostRepositoryOnPrisma)),
//   (c) => c.register(PostQuery, c.resolve(PrismaClient)),
// )(Container.getInstance());

// const container2222 = container2(Container.getInstance());

// container
//   .register(PrismaClient)
//   .register(PostRepositoryOnPrisma, container.resolve(PrismaClient), postSerializer)
//   .register(CreatePostUseCase, container.resolve(PostRepositoryOnPrisma))
//   .register(PostQuery, container.resolve(PrismaClient));

// export { container };
