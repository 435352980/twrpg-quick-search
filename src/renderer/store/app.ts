import { Action, action } from 'easy-peasy';

import DataHelper from '@renderer/dataHelper';

/**
 * 程序模块Model
 */
export interface AppModel {
  /**
   * 语言
   */
  langCursor: number;
  /**
   * war3根目录
   */
  war3Path: string;
  /**
   * 录像保存目录
   */
  exportPath: string;
  /**
   * 是否监听录像
   */
  isListen: boolean;
  /**
   * 缩放
   */
  scale: number;
  /**
   * 数据源
   */
  dataHelper: DataHelper | null;
  /**
   * 设置语言
   */
  setLangCursor: Action<AppModel, number>;
  /**
   * 设置war3根目录
   */
  setWar3Path: Action<AppModel, string>;
  /**
   * 设置录像保存目录
   */
  setExportPath: Action<AppModel, string>;
  /**
   * 设置是否监听
   */
  setIsListen: Action<AppModel, boolean>;
  /**
   * 设置缩放
   */
  setScale: Action<AppModel, number>;

  /**
   * 设置数据源工具
   */
  setDataHelper: Action<AppModel, DataHelper>;
}

const appModel: AppModel = {
  langCursor: 0,
  war3Path: '',
  exportPath: '',
  isListen: false,
  scale: 1,
  dataHelper: null,
  setLangCursor: action((state, payload) => {
    state.langCursor = payload > 2 ? 0 : payload;
  }),
  setWar3Path: action((state, payload) => {
    state.war3Path = payload;
  }),
  setExportPath: action((state, payload) => {
    state.exportPath = payload;
  }),
  setIsListen: action((state, payload) => {
    state.isListen = payload;
  }),
  setScale: action((state, payload) => {
    state.scale = payload;
  }),

  setDataHelper: action((state, payload) => {
    state.dataHelper = payload;
  }),
};

export default appModel;
