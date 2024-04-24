interface SaveFileInfo {
  /**
   * 存档文件名称
   */
  file: string;
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
}

/**
 * 获取存档文件中的 玩家ID、版本、职业、等级、
 * @param source 存档文件
 * @param file 存档文件名称
 */
const getSaveFileInfo = (source: string, file?: string): SaveFileInfo | null => {
  try {
    const playerName = (/游戏ID: (.*)"/.exec(source) || [])[1];
    const version = (/游戏版本: (.*)"/.exec(source) || [])[1];
    const compatible = (/兼容版本: (.*)"/.exec(source) || [])[1];
    const heroName = (/职业: (.*)"/.exec(source) || [])[1];
    const level = (/等级: (.*)"/.exec(source) || [])[1];

    return {
      ...(file ? { file } : null),
      ...(playerName ? { playerName } : null),
      ...(heroName ? { heroName } : null),
      ...(level ? { level } : null),
      ...(version ? { version } : null),
      ...(compatible ? { compatible } : null),
    };
  } catch (error) {
    return null;
  }
};

export default getSaveFileInfo;
