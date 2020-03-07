import stageGoods from '@renderer/seed/stageGoods.json';
import stageUnits from '@renderer/seed/stageUnits.json';
import extractHeroes from '@renderer/seed/extractHeroes.json';
import extractDrops from '@renderer/seed/extractDrops.json';
import extractMakes from '@renderer/seed/extractMakes.json';
import images from '@renderer/seed/images.json';
import DataHelper from '@renderer/dataHelper';

export default new DataHelper(
  stageGoods,
  stageUnits,
  extractHeroes,
  extractDrops,
  extractMakes,
  images,
);
