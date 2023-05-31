import { v4 as uuidv4 } from 'uuid';
import { Brand } from './type';
export const generateId = uuidv4 as () => IdType;

export type IdType = Brand<string, 'Id'>;
