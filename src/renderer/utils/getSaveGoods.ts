/**
 * 匹配物品名称及描述中需要被删除的颜色以及无用符号
 * @param str 物品说明文本
 */
export const formatGoodString = (str: string) => {
  const ARM_NAME_REPLACEITEM = /\s-\s|·\s|\s·|·|\s-\s/g;
  return str
    .replace(ARM_NAME_REPLACEITEM, ' ')
    .replace(/\|r|\|/g, '')
    .replace(/r$/g, '')
    .replace(/^\s+/g, '')
    .replace(/\s+$/g, '');
};

/**
 * 从存档中读取物品信息
 * @param source 存档文本
 */
const getSaveGoods = (source: string) => {
  try {
    let cursor = 0;
    const result: string[][] = [[], [], [], []];
    const arr = source.split(/(\r\n|\n)/);
    arr.forEach(text => {
      if (text.includes('-背包-') || text.includes('-仓库-') || text.includes('-粉末背包-')) {
        cursor++;
      }
      const match = /([0-9]+)\. (.*)"/.exec(text);
      if (match) {
        result[cursor].push(formatGoodString(match[2]));
      }
    });
    // console.log(result);
    return result;
  } catch (error) {
    return [];
  }
};

export default getSaveGoods;
