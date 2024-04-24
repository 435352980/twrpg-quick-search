const formatGoodString = (str: string) => {
  /**
   * 匹配物品名称及描述中需要被删除的颜色以及无用符号
   */
  const ARM_NAME_REPLACEITEM = /\s-\s|·\s|\s·|·|\s-\s/g;
  const strBase = str.replace(ARM_NAME_REPLACEITEM, ' ').replace(/\|r|\|/g, '');

  // 中文有时候后边会带上一个r结尾
  if (/\p{Script=Han}/u.test(strBase)) {
    return strBase
      .replace(/r$/g, '')
      .replace(/^\s+/g, '')
      .replace(/\s+$/g, '');
  } else {
    return strBase.replace(/^\s+/g, '').replace(/\s+$/g, '');
  }
};

const getSaveGoods = (source: string) => {
  const CHUNK_START = /-+[\p{Script=Han}]*-+/u;
  try {
    let cursor = 0;
    const result: string[][] = [];
    const arr = source.split(/(\r\n|\n)/);
    arr.forEach(text => {
      // 信息块与物品块采用一致的开头,但不会读取到结果
      if (CHUNK_START.test(text) && result[cursor]) {
        cursor++;
      }
      const match = /([0-9]+)\. (.*)"/.exec(text);
      if (match) {
        result[cursor] = result[cursor] || [];
        result[cursor].push(formatGoodString(match[2]));
      }
    });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getSaveGoods;
