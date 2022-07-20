// main
declare module 'lodash-id';
declare module 'tga' {
  export default class TGA {
    width: number;
    height: number;
    pixels: Buffer;
    constructor(buff: Buffer, options?: { isFlipY: boolean });
  }
}

// renderer
declare module '*.json';
declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.data';

// common

/**
 * 存档记录
 */
interface SaveRecord {
  /**
   * Record ID
   */
  id: string;

  /**
   * 记录来源(txt文件名)
   */
  file: string;

  /**
   * 物品集合(按名称 使用二维数组存储以适应后续可能加长的物品列表)
   */
  lists: string[][];

  /**
   * 存档代码(分段集)
   */
  codes: string[];

  /**
   * 游戏ID
   */
  playerName?: string;
  /**
   * 游戏版本
   */
  version?: string;
  /**
   * 兼容版本
   */
  compatible?: string;
  /**
   * 英雄职业
   */
  heroName?: string;
  /**
   * 等级
   */
  level?: string;

  /**
   * 处理日期
   */
  time: string;
}

/**
 * 分组
 */
interface Team {
  /**
   * Team ID
   */
  id: string;

  /**
   * 分组名称
   */
  name: string;

  /**
   * 处理日期
   */
  time: string;
}

/**
 * 分组成员
 */
interface TeamMember {
  /**
   * Player ID
   */
  id: string;

  /**
   * 玩家所属Team名称
   */
  teamName: string;

  /**
   * 玩家名称
   */
  name: string;

  /**
   * 所选英雄ID
   */
  heroId: string;

  /**
   * 面板物品
   */
  panel: string[];

  /**
   * 背包物品
   */
  bag: string[];

  /**
   * 仓库物品
   */
  store: string[];

  /**
   * 目标物品
   */
  target: string[];

  /**
   * 处理日期
   */
  time: string;

  /**
   * 更新日期
   */
  updateTime: string;
}

/**
 * 目标(对应存档文件)
 */
interface Target {
  /**
   * Target ID
   */
  id: string;
  /**
   * 目标别称
   */
  name: string;
  /**
   * 目标列表
   */
  targets: string[];
}
