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
   * 存档代码(适配新的代码处理)
   */
  codes: string[];

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
   * 粉末背包
   */
  dust: string[];

  /**
   * 处理日期
   */
  time: string;
}

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

interface Player {
  /**
   * Player ID
   */
  id: string;

  /**
   * 玩家所属Team名称
   */
  team: string;

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
   * 粉末背包
   */
  dust: string[];

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
