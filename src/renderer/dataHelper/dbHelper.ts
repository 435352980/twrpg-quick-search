export default class DBHelper<T extends { [propName: string]: any }> {
  private db: T[];

  public constructor(db: T[]) {
    this.db = db;
  }

  public find(filterFn: (item: T) => boolean): T;
  public find(name: keyof T, value: string): T;
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
  public filter(name: keyof T, value: string): T[];
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

  /**
   * 获取源数组
   */
  public raw() {
    return this.db;
  }

  /**
   * 取数组定量的值
   * @param num take的数量
   */
  public take(num = 1) {
    return this.db.slice(0, num);
  }

  getListByFieldValues(values: any[], field: keyof T) {
    const result = [];
    values.forEach(value => {
      const findItem = this.db.find(item => item[field] === value);
      if (findItem) {
        result.push(findItem);
      }
    });
    return result as T[];
  }

  /**
   * 覆盖JSON.stringifg
   */
  toJSON() {
    return this.db;
  }
}
