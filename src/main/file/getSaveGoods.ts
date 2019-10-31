import { formatGoodString } from '../common';

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
    return result;
  } catch (error) {
    return [];
  }
};

export default getSaveGoods;
