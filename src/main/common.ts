/**
 * 获取存档代码
 * @param {String} str
 */
export const getSaveCodes = (source: string) =>
  source.match(/-load [a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/,'<>~\·`\?:;|]+/g);

/**
 * 时间戳格式(记录)
 */
export const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 时间戳格式(文件夹)
 */
export const TIMESTAMP_FOLDER_FORMAT = 'YYYY-MM-DD-HH-mm-ss';

export const formatGoodString = (str: string) => {
  /**
   * 匹配物品名称及描述中需要被删除的颜色以及无用符号
   */
  const ARM_NAME_REPLACEITEM = /\s-\s|·\s|\s·|·|\s-\s/g;
  return str
    .replace(ARM_NAME_REPLACEITEM, ' ')
    .replace(/\|r|\|/g, '')
    .replace(/r$/g, '')
    .replace(/^\s+/g, '')
    .replace(/\s+$/g, '');
};
