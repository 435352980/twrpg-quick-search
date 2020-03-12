import seed from '@renderer/seed';
import DataHelper from '@renderer/dataHelper';

const getDataSource = (lang: 'cn' | 'en' | 'ko' = 'cn') =>
  seed.then(({ images, ...source }) => {
    const { stageGoods, stageUnits, heroes, drops, makes } = source[lang];
    return new DataHelper(stageGoods, stageUnits, heroes, drops, makes, images);
  });

export default getDataSource;
