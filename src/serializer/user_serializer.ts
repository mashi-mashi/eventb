import { User as PrismaUser } from '@prisma/client';
import { match } from 'ts-pattern';
import { BaseUser, UserEvent, UserIdType } from '../model/user/base_user';
import { User } from '../model/user/user';
import { Serializable, WithoutTimestamp } from './serializable';

export type UserSerializerType = Serializable<BaseUser, PrismaUser, UserEvent>;

export const userSerializer: UserSerializerType = {
  serialize(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      kind: user.kind,
    } as WithoutTimestamp<PrismaUser>;
  },
  desrialize(json) {
    return match(json)
      .with({ kind: 'User' }, (json) => {
        return User.of({
          id: json.id as UserIdType,
          name: json.name,
          email: json.email ?? undefined,
        });
      })
      .otherwise(() => {
        throw new Error('Invalid json');
      });
  },
  serializeEvents(events: UserEvent[]) {
    return events.map((event) => {
      return {
        entityId: event.entityId,
        type: event.type,
        payload: event,
      };
    });
  },
};
