import { Action, action } from 'easy-peasy';

/**
 * 程序模块Model
 */
export interface AppModel {
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
}

const appModel: AppModel = {
  war3Path: '',
  exportPath: '',
  isListen: false,
  scale: 1,
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
};

export default appModel;
