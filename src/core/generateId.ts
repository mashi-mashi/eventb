import { v4 as uuidv4 } from 'uuid'
import { Brand } from './type'

export const generateId = uuidv4 as <T>() => IdType<T>
export type IdType<T> = Brand<string, T>
