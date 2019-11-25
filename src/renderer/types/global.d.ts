/**
 * 程序名
 */
declare const APP_NAME: string;
/**
 * 版本号
 */
declare const APP_VERSION: string;

/**
 * 附加模型定义
 */
interface AttachModelConfig {
  /**
   * 模型关联物品ID
   */
  id: string;
  /**
   * 模型关联物品名称
   */
  name: string;
  /**
   * 模型名称
   */
  modelName: string;
  /**
   * 位置
   */
  location: string;
}

declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.gif';
declare module '*.txt';
declare module '*.less';
declare module '*.css';
