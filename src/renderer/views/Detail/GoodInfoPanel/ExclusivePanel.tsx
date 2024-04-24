import React, { FC } from 'react';
import { useStoreState } from '@renderer/store';
import { CardHeader } from '@mui/material';
import { Good } from '@renderer/dataHelper/types';
import GamePanel from '@renderer/components/GamePanel';

const ExclusivePanel: FC<{ data: Good }> = ({ data }) => {
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const local = useStoreState(state => state.app.local);
  const exclusives = dataHelper.getExclusivesByGoodId(data.id);
  return (
    <>
      {exclusives.length > 0 && (
        <div>
          <CardHeader title={local.views.good.exclusives}></CardHeader>
          {exclusives.map((info, index) => (
            <GamePanel
              key={index}
              desc={info.name + '\n' + info.on + '\n|c00ffff00' + info.desc}
              style={{ marginBottom: 8 }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ExclusivePanel;
