import { Action, action } from 'easy-peasy';

import DataHelper from '@renderer/dataHelper';
const getLangCursor = () => {
  const lang = navigator?.language?.toLowerCase() || '';
  if (lang.includes('cn')) {
    return 0;
  }
  if (lang.includes('en')) {
    return 1;
  }
  if (lang.includes('ko')) {
    return 2;
  }
  return 1;
};

/**
 * 程序模块Model
 */
export interface AppModel {
  /**
   * 语言
   */
  langCursor: number;
  /**
   * 界面文本
   */
  local: Local;
  /**
   * war3根目录
   */
  war3Path: string;
  /**
   * 文档目录
   */
  documentsPath: string;
  /**
   * 录像保存目录
   */
  exportPath: string;
  /**
   * 是否监听录像
   */
  isListen: boolean;
  /**
   * 需要监听的录像文件扩展名
   */
  repExt: string;
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
   * 设置界面文本
   */
  setLocal: Action<AppModel, Local>;
  /**
   * 设置war3根目录
   */
  setWar3Path: Action<AppModel, string>;
  /**
   * 设置war3根目录
   */
  setDocumentsPath: Action<AppModel, string>;
  /**
   * 设置录像保存目录
   */
  setExportPath: Action<AppModel, string>;
  /**
   * 设置是否监听
   */
  setIsListen: Action<AppModel, boolean>;
  /**
   * 设置需要监听的录像文件扩展名
   */
  setRepExt: Action<AppModel, string>;
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
  langCursor: getLangCursor(),
  local: null,
  war3Path: '',
  documentsPath: '',
  exportPath: '',
  isListen: false,
  repExt: '',
  scale: 1,
  dataHelper: null,
  setLangCursor: action((state, payload) => {
    state.langCursor = payload > 2 ? 0 : payload;
  }),
  setLocal: action((state, payload) => {
    state.local = payload;
  }),
  setWar3Path: action((state, payload) => {
    state.war3Path = payload;
  }),
  setDocumentsPath: action((state, payload) => {
    state.documentsPath = payload;
  }),
  setExportPath: action((state, payload) => {
    state.exportPath = payload;
  }),
  setIsListen: action((state, payload) => {
    state.isListen = payload;
  }),
  setRepExt: action((state, payload) => {
    state.repExt = payload;
  }),
  setScale: action((state, payload) => {
    state.scale = payload;
  }),

  setDataHelper: action((state, payload) => {
    state.dataHelper = payload;
  }),
};

export default appModel;
