import React, { FC } from 'react';
import { Unit, ObjDisplayInfo } from '@renderer/dataHelper/types';
import DataHelper from '@renderer/dataHelper';
import UnitAttrs from '@renderer/components/UnitAttrs';
import BossDropPanel from './BossDropPanel';

const BossInfoPanel: FC<{
  data: Unit;
  dataHelper: DataHelper;
  handleImgClick: (info: ObjDisplayInfo) => void;
  handleImgContextMenu: (info: ObjDisplayInfo) => void;
  local: Local;
}> = ({ data, handleImgClick, handleImgContextMenu, local }) => {
  return (
    <>
      <UnitAttrs data={data} />
      <BossDropPanel
        local={local}
        data={data}
        handleImgClick={handleImgClick}
        handleImgContextMenu={handleImgContextMenu}
      />
    </>
  );
};

export default BossInfoPanel;
