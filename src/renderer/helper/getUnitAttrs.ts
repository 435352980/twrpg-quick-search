import { W3uUnit } from '@renderer/dataHelper/types';

const getUnitAttrs = (data: W3uUnit, local: Local): [string, string | number][] =>
  Object.entries(local.common.unitProps).reduce((acc, [key, name]) => {
    const value = data[key];
    if (value) {
      if (typeof value === 'number' && parseInt(value.toFixed(1)) !== 0) {
        acc.push([name, typeof value === 'number' ? value.toFixed(1).replace(/\.0$/, '') : value]);
      }
    }
    return acc;
  }, []);

export default getUnitAttrs;
