import goods from './goods';
import heroes from './heroes';
import units from './units';
import images from './images';

class DBHelper<T extends { [propName: string]: any }> {
  private db: T[];

  public constructor(db: T[]) {
    this.db = db;
  }

  public find(filterFn: (item: T) => boolean): T;
  public find<K extends keyof T>(name: K, value: T[K]): T;
  /**
   * 根据条件查找相应对象
   * @param filterFnOrKey
   * @param value
   */
  public find(filterFnOrKey: ((item: T) => boolean) | keyof T, value?: string) {
    if (typeof filterFnOrKey === 'function') {
      return this.db.find(filterFnOrKey);
    }
    return this.db.find(item => item[filterFnOrKey] === value);
  }

  public findIndex(filterFn: (item: T) => boolean): number;
  public findIndex<K extends keyof T>(name: K, value: T[K]): number;
  /**
   * 根据条件查找相应对象位置
   * @param filterFnOrKey
   * @param value
   */
  public findIndex(filterFnOrKey: ((item: T) => boolean) | keyof T, value?: string) {
    if (typeof filterFnOrKey === 'function') {
      return this.db.findIndex(filterFnOrKey);
    }
    return this.db.findIndex(item => item[filterFnOrKey] === value);
  }

  public filter(filterFn: (item: T) => boolean): T[];
  public filter<K extends keyof T>(name: K, value: T[K]): T[];
  /**
   * 根据条件过滤相应对象
   * @param filterFnOrKey
   * @param value
   */
  public filter(filterFnOrKey: ((item: T) => boolean) | keyof T, value?: string) {
    if (typeof filterFnOrKey === 'function') {
      return this.db.filter(filterFnOrKey);
    }
    return this.db.filter(item => item[filterFnOrKey] === value);
  }

  public getAll() {
    return this.db;
  }
}

export function getDb(dbName: 'goods'): DBHelper<Good>;
export function getDb(dbName: 'heroes'): DBHelper<Hero>;
export function getDb(dbName: 'units'): DBHelper<Unit>;
/**
 * 获取数据库
 * @param dbName 数据库名称
 */
export function getDb(dbName: 'goods' | 'heroes' | 'units') {
  return {
    goods: new DBHelper<Good>(goods as Good[]),
    heroes: new DBHelper<Hero>(heroes as Hero[]),
    units: new DBHelper<Unit>(units as Unit[]),
  }[dbName];
}

/**
 * 获取图片
 * @param imageName 图片名称
 */
export const getImage = (imageName: string) => images[imageName] || '';
