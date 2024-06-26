/* eslint-disable react-hooks/exhaustive-deps  */
import React, { useState, useEffect } from 'react';

import { Typography } from '@mui/material';
import CheckIcon from '@renderer/components/CheckIcon';
import OrgTree from '@renderer/components/OrgTree';
import Tag, { TagIcon, TagText } from '@renderer/components/Tag';
import { SplitGoodNode } from '@renderer/dataHelper/types';
import { useStoreActions, useStoreState } from '@renderer/store';
import { getAnchor } from '@renderer/helper';
import muiDeepOrange from '@mui/material/colors/deepOrange';

import styled from '@emotion/styled';

const NoWrapText = styled(Typography)`
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const SplitChart: React.FC<{ id: string | undefined | null; haves?: string[]; tipId?: string }> = ({
  id,
  haves = [],
  // tipId = 'splitTree',
}) => {
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const [excludeIds, setExcludeIds] = useState<string[]>();

  /**
   * 显示/隐藏节点
   */
  const toggleNode = (id: string) => {
    excludeIds.includes(id)
      ? setExcludeIds(excludeIds.filter(excludeId => excludeId !== id))
      : setExcludeIds([...excludeIds, id]);
  };

  useEffect(() => {
    setExcludeIds([...new Set([...haves, ...dataHelper.getSplitDefautHiddenIds()])]);
  }, [haves.toString()]);

  if (!id) {
    return null;
  }
  const tree = dataHelper.splitGoodById(id, excludeIds);
  return (
    <div>
      <OrgTree<SplitGoodNode>
        tree={tree}
        label={({ id, name, imgData, stage, num, choose, multiWays, hasChild }) => {
          const haveCount = haves.filter(have => have === id).length;
          return (
            <Tag>
              <TagIcon src={imgData} onClick={() => hasChild && toggleNode(id)} />
              <TagText
                onClick={e => setDetailView({ id, show: true, isGood: true, anchor: getAnchor(e) })}
              >
                {/* 名称及数量 */}
                <NoWrapText color={hasChild ? 'primary' : 'textPrimary'} variant="body1">{`${name}${
                  num > 1 ? `x${num}` : ''
                }`}</NoWrapText>
                {/* 是否可选 */}
                <NoWrapText variant="body1" color="secondary">
                  {choose && (
                    <NoWrapText
                      variant="body1"
                      component="span"
                      style={{
                        color: muiDeepOrange.A400,
                      }}
                    >
                      {`[${(choose as any).join(' / ')}]`}
                    </NoWrapText>
                  )}

                  {`${choose ? `(${local.common.optional})` : ''}`}
                </NoWrapText>
                {/* 阶段 */}
                <NoWrapText variant="body1" color="secondary">
                  {local.common.stages[stage] || ''}
                </NoWrapText>
                {/* 多来源 */}
                {multiWays && (
                  <NoWrapText
                    variant="body1"
                    style={{
                      color: muiDeepOrange.A400,
                    }}
                  >
                    [{local.common.multiWays}]
                  </NoWrapText>
                )}
                {/* 持有处理(显示打勾图标) */}
                {haveCount > 0 && <CheckIcon size={24} />}
              </TagText>
            </Tag>
          );
        }}
      />
    </div>
  );
};

export default React.memo(SplitChart);
