// import Datastore, { AdapterAsync, LowdbAsync } from 'lowdb';
import Datastore from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
// import { ObjectChain } from 'lodash';
const LodashId = require('lodash-id');

declare module 'lodash' {
  interface LoDashStatic {
    id: string;
    createId(): string;
  }
  interface CollectionChain<T> {
    getById(id: string): ObjectChain<T | undefined>;
    insert: (doc: Omit<T, 'id'>) => ObjectChain<T>;
    upsert: (doc: Omit<T, 'id'>) => ObjectChain<T>;
    updateById: (id: string, doc: T) => ObjectChain<T | undefined>;
    updateWhere: (
      whereAttrs: { [P in keyof T]?: T[P] },
      attrs: { [P in keyof T]?: T[P] },
    ) => CollectionChain<T[]>;
    replaceById: (id: keyof T, attrs: { [P in keyof T]?: T[P] }) => ObjectChain<T | undefined>;
    removeById: (id: string) => ObjectChain<T | undefined>;
    removeWhere: (whereAttrs: { [P in keyof T]?: T[P] }) => CollectionChain<T[]>;
  }
  interface LoDashExplicitWrapper<TValue> {
    createId(): string;
  }
}

interface DataModel {
  files: string[];
  records: SaveRecord[];
  teams: string[];
  players: Player[];
}

export default (fileName: string) => {
  const adapter = new FileSync<DataModel>(fileName);
  const db = Datastore(adapter);
  db._.mixin(LodashId);
  // db._.id = '_id';
  return db;
};