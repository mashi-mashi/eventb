import { JsonType, Serializable } from '../core/serializable';

type DataBaseType = {
  store: (any: JsonType) => void;
};

export type PostSerializer = Serializable;

export function createPost(db: DataBaseType, serializer: PostSerializer) {
  serializer.serialize();
  db.store(serializer.serialize());
  serializer.serializeEvents().forEach((event) => {
    db.store(event);
  });
}
