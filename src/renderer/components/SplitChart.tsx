/* eslint-disable react-hooks/exhaustive-deps  */
import React, { useState, useEffect } from 'react';

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
// import green from '@material-ui/core/colors/green';
// import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// import ReactTooltip from 'react-tooltip';
import CheckIcon from './CheckIcon';
import OrgTree from '@/components/OrgTree';
import { getImage } from '@/db';
import IconLabel from '@/components/Iconabel';
import { splitGoodById, SplitGoodData } from '@/utils/splitGoodById';
import { useStoreActions } from '@/store';
import { getAnchor } from '@/utils/common';
import { blueTip } from '@/theme/common';

const useStyles = makeStyles({
  splitTip: {
    color: '#000!important',
    ...blueTip,
    fontSize: '1.3rem!important',
    zIndex: '1100!important' as any,
  },
  checkIcon: { width: 24 },
});

const SplitChart: React.FC<{ id: string | undefined | null; haves?: string[]; tipId?: string }> = ({
  id,
  haves = [],
  // tipId = 'splitTree',
}) => {
  const classes = useStyles();
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const [excludeIds, setExcludeIds] = useState<string[]>([]);

  /**
   * 显示/隐藏节点
   */
  const toggleNode = (id: string) => {
    excludeIds.includes(id)
      ? setExcludeIds(excludeIds.filter(excludeId => excludeId !== id))
      : setExcludeIds([...excludeIds, id]);
  };

  useEffect(() => {
    setExcludeIds(haves);
  }, [haves.toString()]);

  if (!id) {
    return null;
  }
  const tree = splitGoodById(id, excludeIds);
  return (
    <div>
      <OrgTree<SplitGoodData>
        tree={tree}
        label={({ id, name, img, num, choose, hasChild, stageDesc }) => {
          const haveCount = haves.filter(have => have === id).length;
          return (
            <IconLabel
              icon={getImage(img)}
              text={
                <>
                  {`${name}${num && num !== 1 ? `x${num}` : ''}`}
                  <Typography variant="body1" color="secondary">
                    {`${choose ? '(可选)' : ''}`}
                  </Typography>
                  <Typography variant="body1" color="secondary">
                    {stageDesc ? `[${stageDesc}]` : ''}
                  </Typography>
                  {/* 持有处理(显示打勾图标) */}
                  {haveCount > 0 && <CheckIcon className={classes.checkIcon} />}
                </>
              }
              textProps={{ color: hasChild ? 'primary' : 'textPrimary' }}
              {...(hasChild ? { onIconClick: () => toggleNode(id) } : null)}
              onTextClick={e =>
                setDetailView({ id, show: true, isGood: true, anchor: getAnchor(e) })
              }
            ></IconLabel>
          );
        }}
      ></OrgTree>
      {/* <ReactTooltip
        id={tipId}
        effect="solid"
        place="top"
        type="warning"
        multiline
        className={classes.splitTip}
        getContent={() => (dropBys ? getSplitTipContent(dropBys) : null)}
      /> */}
    </div>
  );
};

export default React.memo(SplitChart);
