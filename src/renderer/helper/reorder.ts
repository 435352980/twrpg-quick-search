/**
 * 移动数组项,返回新数组
 * @param list 待处理的数组
 * @param startIndex 移动项初始索引
 * @param endIndex 移动项移动到的索引
 */
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default reorder;
