/**
 * 获取挂载位置
 * @param e 鼠标事件
 */
const getAnchor = (e: { clientX: number; [propName: string]: any }) =>
  e.clientX >= window.innerWidth / 2 ? 'left' : 'right';

export default getAnchor;
