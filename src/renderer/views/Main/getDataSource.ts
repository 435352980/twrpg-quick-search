import seed from '@renderer/seed';
import DataHelper from '@renderer/dataHelper';

const getDataSource = (lang: 'cn' | 'en' | 'ko' = 'cn') =>
  seed.then(({ images, ...source }) => {
    const {
      stageGoods,
      stageUnits,
      heroes,
      drops,
      makes,
      exclusives,
      skinConfig,
      skinMapping,
    } = source[lang];
    return new DataHelper(
      stageGoods,
      stageUnits,
      heroes,
      drops,
      makes,
      exclusives,
      skinConfig,
      skinMapping,
      images,
      lang,
    );
  });

export default getDataSource;
