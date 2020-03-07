import React, { FC } from 'react';
import { Good, ObjDisplayInfo } from '@renderer/dataHelper/types';
import DataHelper from '@renderer/dataHelper';
import DropFromPanel from './DropFromPanel';
import BuildFromPanel from './BuildFromPanel';
import MakeToPanel from './MakeToPanel';

const GoodInfoPanel: FC<{
  data: Good;
  dataHelper: DataHelper;
  handleImgClick: (info: ObjDisplayInfo) => void;
  handleImgContextMenu: (info: ObjDisplayInfo) => void;
}> = ({ data, dataHelper, handleImgClick, handleImgContextMenu }) => {
  return (
    <>
      {data.dropFroms && (
        <DropFromPanel
          data={data}
          handleImgClick={handleImgClick}
          handleImgContextMenu={handleImgContextMenu}
        />
      )}
      {data.buildFroms && (
        <BuildFromPanel
          data={data}
          goodDB={dataHelper.goodDB}
          handleImgClick={handleImgClick}
          handleImgContextMenu={handleImgContextMenu}
        />
      )}
      {data.makeTos && (
        <MakeToPanel
          makeTos={data.makeTos}
          handleImgClick={handleImgClick}
          handleImgContextMenu={handleImgContextMenu}
        />
      )}
    </>
  );
};

export default GoodInfoPanel;
