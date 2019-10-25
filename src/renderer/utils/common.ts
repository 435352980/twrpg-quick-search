/**
 * 格式化提示框文本
 * @param tipChunks 提示框文本段
 */
export const formatTipString = (...tipChunks: string[]) =>
  tipChunks
    .reduce((pre: string[], chunk) => {
      if (chunk) {
        pre.push(chunk.replace(/\r\n|\n/g, '<br/>'));
      }
      return pre;
    }, [])
    .join('<br/>');
/**
 * 获取挂载位置
 * @param e 鼠标事件
 */
export const getAnchor = (e: { clientX: number; [propName: string]: any }) =>
  e.clientX >= window.innerWidth / 2 ? 'left' : 'right';

/**
 * 获取阶段名称
 * @param stage 阶段对应数值
 */
export const getStageName = (stage: number | null) => {
  switch (stage) {
    case 6:
      return '白怨火';
    case 5:
      return '主龙';
    case 4:
      return '四大';
    case 3:
      return '小四';
    case 2:
      return '粉末';
    case 1:
      return '野外';
    default:
      return '';
  }
};

/**
 * 移动数组项,返回新数组
 * @param list 待处理的数组
 * @param startIndex 移动项初始索引
 * @param endIndex 移动项移动到的索引
 */
export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * 匹配存档文件中的存档代码
 * @param source txt文本
 */
export const getSaveCodes = (source: string) =>
  source.match(/-load [a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/,'<>~\·`\?:;|]+/g);
