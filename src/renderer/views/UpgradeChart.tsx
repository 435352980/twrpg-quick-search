import React from 'react';

import { Typography } from '@mui/material';
import Tag, { TagIcon, TagText } from '@renderer/components/Tag';
import { useStoreState, useStoreActions } from '@renderer/store';
import { getAnchor } from '@renderer/helper';
import OrgTree from '@renderer/components/OrgTree';
import { UpgradeGoodNode } from '@renderer/dataHelper/types';

const UpgradeChart: React.FC<{ id: string | undefined | null }> = ({ id }) => {
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  if (!id) {
    return null;
  }
  const tree = dataHelper.getUpdateWaysById(id);
  return (
    <div>
      <OrgTree<UpgradeGoodNode>
        tree={tree}
        label={({ id, name, imgData, stage }) => {
          return (
            <Tag>
              <TagIcon
                src={imgData}
                onClick={e => setDetailView({ id, show: true, isGood: true, anchor: getAnchor(e) })}
              />
              <TagText>
                <Typography variant="body1">{name}</Typography>
                <Typography variant="body1" color="secondary">
                  {local.common.stages[stage] || ''}
                </Typography>
              </TagText>
            </Tag>
          );
        }}
      />
    </div>
  );
};

export default React.memo(UpgradeChart);
