import { getDb } from '@/db';

export interface UpgradeGoodData extends Good {
  hasChild?: boolean;
}

/**
 * 根据物品ID拆解物品
 * @param id 物品ID
 * @param excludeIds 不需要展现子项的物品ID
 */
const findUpdateWaysById = (id: string): TreeData<UpgradeGoodData> => {
  const source = getDb('goods').find('id', id);
  const { makeTo = [] } = source;
  // 默认排除粉末与毛皮项
  const children = makeTo.map(info => findUpdateWaysById(info.id));

  if (children && children.length > 0) {
    return { ...source, children, hasChild: true };
  } else {
    return { ...source, hasChild: !!source.makeTo };
  }
};

export default findUpdateWaysById;
