import { Action, action } from 'easy-peasy';

/**
 * 物品模块Model
 */
export interface GoodModel {
  /**
   * 是否只显示必要装备
   */
  useMust: boolean;
  /**
   * 设置必要装备显示
   */
  setUseMust: Action<GoodModel, boolean>;

  /**
   * 检索文本
   */
  filterText: string;
  /**
   * 设置检索文本
   */
  setFilterText: Action<GoodModel, string>;

  /**
   * 类型过滤
   */
  filterCat: string | null;
  /**
   * 设置类型过滤
   */
  setFilterCat: Action<GoodModel, string | null>;

  /**
   * 阶段过滤
   */
  filterStage: number | null;
  /**
   * 设置阶段过滤
   */
  setFilterStage: Action<GoodModel, number | null>;

  /**
   * 缓存栏ID列表
   */
  cacheIds: string[];
  /**
   * 添加缓存ID
   */
  addCacheId: Action<GoodModel, string>;
  /**
   * 移除缓存ID
   */
  removeCacheId: Action<GoodModel, string>;
  /**
   * 设置缓存ID
   */
  setCacheIds: Action<GoodModel, string[]>;

  /**
   * 显示/隐藏缓存列表
   */
  showCache: boolean;
  /**
   * 设置缓存列表显示/隐藏
   */
  setShowCache: Action<GoodModel, boolean>;
}

const goodModel: GoodModel = {
  useMust: false,
  setUseMust: action((state, payload) => {
    state.useMust = payload;
  }),

  filterText: '',
  setFilterText: action((state, payload) => {
    state.filterText = payload;
    //重置分类及阶段
    state.filterCat = null;
    state.filterStage = null;
    //隐藏缓存
    state.showCache = false;
  }),

  filterCat: null,
  setFilterCat: action((state, payload) => {
    state.filterCat = payload;
    //重置检索文本
    state.filterText = '';
    //隐藏缓存
    state.showCache = false;
  }),

  filterStage: null,
  setFilterStage: action((state, payload) => {
    state.filterStage = payload;
    //重置检索文本
    state.filterText = '';
    //隐藏缓存
    state.showCache = false;
  }),

  cacheIds: [],
  addCacheId: action((state, payload) => {
    if (!state.cacheIds.includes(payload)) {
      state.cacheIds.push(payload);
    }
  }),
  removeCacheId: action((state, payload) => {
    const newCacheIds = state.cacheIds.filter(id => id !== payload);
    state.cacheIds = newCacheIds;
    //当缓存为空时,清除缓存显示状态
    if (newCacheIds.length === 0) {
      state.showCache = false;
    }
  }),
  setCacheIds: action((state, payload) => {
    state.cacheIds = payload;
  }),

  showCache: false,
  setShowCache: action((state, payload) => {
    state.showCache = payload;
  }),
};

export default goodModel;
