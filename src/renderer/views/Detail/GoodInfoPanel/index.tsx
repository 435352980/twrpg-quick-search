import React, { FC } from 'react';
import { Good, ObjDisplayInfo } from '@renderer/dataHelper/types';
import DataHelper from '@renderer/dataHelper';
import DropFromPanel from './DropFromPanel';
import BuildFromPanel from './BuildFromPanel';
import MakeToPanel from './MakeToPanel';
import ExclusivePanel from './ExclusivePanel';

const GoodInfoPanel: FC<{
  data: Good;
  dataHelper: DataHelper;
  handleImgClick: (info: ObjDisplayInfo) => void;
  handleImgContextMenu: (info: ObjDisplayInfo) => void;
  local: Local;
}> = ({ data, dataHelper, handleImgClick, handleImgContextMenu, local }) => {
  return (
    <>
      {data.dropFroms && (
        <DropFromPanel
          local={local}
          data={data}
          handleImgClick={handleImgClick}
          handleImgContextMenu={handleImgContextMenu}
        />
      )}
      {data.buildFroms && (
        <BuildFromPanel
          local={local}
          data={data}
          goodDB={dataHelper.goodDB}
          handleImgClick={handleImgClick}
          handleImgContextMenu={handleImgContextMenu}
        />
      )}
      {data.makeTos && (
        <MakeToPanel
          local={local}
          makeTos={data.makeTos}
          handleImgClick={handleImgClick}
          handleImgContextMenu={handleImgContextMenu}
        />
      )}
      <ExclusivePanel data={data} />
    </>
  );
};

export default GoodInfoPanel;
