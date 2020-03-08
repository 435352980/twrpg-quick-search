import * as seed from '@renderer/seed';
import DataHelper from '@renderer/dataHelper';

const getDataSource = (lang: 'cn' | 'en' | 'ko' = 'cn') => {
  const { stageGoods, stageUnits, extractHeroes, extractDrops, extractMakes, images } = seed[lang];
  return new DataHelper(stageGoods, stageUnits, extractHeroes, extractDrops, extractMakes, images);
};

export default getDataSource;
