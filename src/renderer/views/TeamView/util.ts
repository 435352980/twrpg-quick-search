import { Good } from '@renderer/dataHelper/types';

export const goodDescSort = (key: keyof Good) => (good: Good) => (good[key] ? good[key] : -1);
export const goodAscSort = (key: keyof Good) => (good: Good) => (good[key] ? good[key] : 99);

/**
 * 根据特性ID筛选物品
 * @param list 物品列表
 * @param featureKeys 特性ID列表
 */
export const filterFeatures = (list: Good[], featureKeys: (keyof Good)[]) =>
  featureKeys.length > 0
    ? list.filter(good =>
        featureKeys.every(key => !!good[key] || !good.goodType || good.goodType > 5),
      )
    : list;

/**
 * 根据英雄ID筛选物品
 * @param list 物品列表
 * @param limitHeroKeys 英雄ID列表
 */
export const filterLimit = (list: Good[], limitHeroKeys: string[]) =>
  limitHeroKeys.length > 0
    ? list.filter(good => {
        const limitHeroes = good.limitHeroes;
        return (
          !limitHeroes ||
          limitHeroes.find(info => limitHeroKeys.includes(info.id)) ||
          !good.goodType ||
          good.goodType > 5
        );
      })
    : list;

/**
 * 根据专属ID筛选物品
 * @param list 物品列表
 * @param exclusiveHeroKeys 专属ID列表
 */
export const filterExclusive = (list: Good[], exclusiveHeroKeys: string[]) =>
  exclusiveHeroKeys.length > 0
    ? list.filter(good => {
        const exclusives = good.exclusives;
        return (
          (exclusives &&
            exclusives.length > 0 &&
            exclusives.find(info => exclusiveHeroKeys.includes(info.id))) ||
          !good.goodType ||
          good.goodType > 5
        );
      })
    : list;
