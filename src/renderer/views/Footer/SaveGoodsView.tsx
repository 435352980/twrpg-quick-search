import path from 'path';
import fs from 'fs';
import React from 'react';
import getSaveGoods from '@/utils/getSaveGoods';

import { getDb, getImage } from '@/db';
import { useStoreState } from '@/store';

const SaveGoodsView = () => {
  const war3Path = useStoreState(state => state.app.war3Path);
  const selectedFile = useStoreState(state => state.common.selectedFile);
  if (
    war3Path &&
    selectedFile &&
    fs.existsSync(path.join(war3Path, 'twrpg', `${selectedFile}.txt`))
  ) {
    const source = fs.readFileSync(path.join(war3Path, 'twrpg', `${selectedFile}.txt`)).toString();
    const [panel = [], bag = [], store = [], dust = []] = getSaveGoods(source);
    return (
      <>
        {[...panel, ...bag, ...store, ...dust].map((name, i) => {
          const good = getDb('goods').find('name', name);
          if (good) {
            return (
              <img key={i} style={{ width: 32, height: 32 }} alt={name} src={getImage(good.img)} />
            );
          }
          return (
            <img key={i} style={{ width: 32, height: 32 }} alt={name} src={getImage('BTNSpy')} />
          );
        })}
      </>
    );
  } else {
    return null;
  }
};

export default SaveGoodsView;
