import React from 'react';

import { Typography } from '@material-ui/core';
import OrgTree from '@/components/OrgTree';
import { getImage } from '@/db';
import IconLabel from '@/components/Iconabel';
import findUpdateWaysById, { UpgradeGoodData } from '@/utils/findUpdateWaysById';
import { useStoreActions } from '@/store';
import { getAnchor } from '@/utils/common';

const UpgradeChart: React.FC<{ id: string | undefined | null }> = ({ id }) => {
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  if (!id) {
    return null;
  }
  const tree = findUpdateWaysById(id);
  return (
    <div>
      <OrgTree<UpgradeGoodData>
        tree={tree}
        label={({ id, name, img, stageDesc }) => {
          return (
            <IconLabel
              icon={getImage(img)}
              text={
                <>
                  <Typography variant="body1">{name}</Typography>
                  <Typography variant="body1" color="secondary">
                    {stageDesc ? `[${stageDesc}]` : ''}
                  </Typography>
                </>
              }
              //   textProps={{ color: hasChild ? 'primary' : 'textPrimary' }}
              onIconClick={e =>
                setDetailView({ id, show: true, isGood: true, anchor: getAnchor(e) })
              }
              //   onTextClick={() => console.log(id)}
            ></IconLabel>
          );
        }}
      ></OrgTree>
    </div>
  );
};

export default React.memo(UpgradeChart);
