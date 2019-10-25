import { diff } from 'fast-array-diff';
import { getDb } from '@/db';

/**
 * 统计目标在数组中出现的次数 eg.{ a:1, b:2 }
 * @param arr 待统计的数组
 */
export const arrCount = (arr: string[]) =>
  arr.reduce(
    (counts: { [propName: string]: number }, item: string) => ({
      ...counts,
      [item]: (counts[item] || 0) + 1,
    }),
    {},
  );

/**
 * 计算打平装备需求量信息
 * @param goodIds 需求装备列表
 * @param haveIds 已拥有装备列表
 */
export const diffRequire = (
  goodIds: string[] = [],
  haveIds: string[] = [],
): { sum: string[]; choose: string[]; have: string[] } =>
  goodIds.reduce(
    (acc, id) => {
      // 如果已经持有,移除
      const findIndexParent = acc.have.findIndex(haveId => haveId === id);
      if (findIndexParent !== -1) {
        acc.have = acc.have.filter((haveId, index) => index !== findIndexParent);
        return acc;
      }
      // 获取物品基本信息
      const good = getDb('goods').find('id', id);
      const { name, buildFrom } = good;
      // 排除矿石,树枝等杂项
      if (
        name.includes('凡叔') ||
        name.includes('粉末') ||
        name.includes('矿石') ||
        name.includes('树枝') ||
        name.includes('魔法石') ||
        name.includes('雪原皮')
      ) {
        return acc;
      }
      // 判断物品是否可以被拆分,不可拆分直接返回（排除战斗残骸）
      if (!buildFrom || buildFrom.find(from => from.name === '战斗残骸')) {
        acc.sum = [...acc.sum, id];
        return acc;
      }

      // 可拆分的装备优先计算可选项,然后计算其他子项
      let chooseIds = buildFrom.filter(({ choose }) => choose).map(({ id }) => id);
      // 可选项只要拥有,直接移除相关所有可选项
      const findIndexChoose = acc.have.findIndex(haveId => chooseIds.includes(haveId));
      if (findIndexChoose !== -1) {
        acc.have = acc.have.filter((haveId, index) => index !== findIndexChoose);
        chooseIds = [];
      }
      acc.choose = [...acc.choose, ...chooseIds];
      acc.sum = [...acc.sum, ...chooseIds];
      const subIds = buildFrom.filter(({ choose }) => !choose).map(({ id }) => id);
      const subDiff = diff(subIds, acc.have);
      const { sum, choose, have } = diffRequire(subDiff.removed, subDiff.added);
      return { sum: [...acc.sum, ...sum], choose: [...acc.choose, ...choose], have };
    },
    { sum: [], choose: [], have: haveIds } as { sum: string[]; choose: string[]; have: string[] },
  );

/**
 * 返回需求物品ID依据需求量的大小降序排序的结果
 * @param count 必须物品统计对象 eg.{ a:1, b:2 }
 * @param chooseCount 可选物品统计对象 eg.{ a:1, b:2 }
 */
const getCountSortedKeys = (
  count: { [propName: string]: number },
  chooseCount: { [propName: string]: number },
) =>
  Object.keys(count).sort(
    (a, b) =>
      count[b] -
      (chooseCount[b] ? chooseCount[b] : 0) -
      (count[a] - (chooseCount[a] ? chooseCount[a] : 0)),
  );

/**
 * 计算整体需求量,返回需求量信息
 * @param goodIds 需求装备列表
 * @param haveIds 已拥有装备列表
 */
export const diffRequireInfo = (goodIds: string[] = [], haveIds: string[] = []) => {
  const { sum, choose, have } = diffRequire(goodIds, haveIds);
  const sumCount = arrCount(sum);
  const chooseCount = arrCount(choose);
  const haveCount = arrCount(have);
  return {
    sum,
    sumCount,
    choose,
    chooseCount,
    have,
    haveCount,
    sortedSumKeys: getCountSortedKeys(sumCount, chooseCount),
  };
};
