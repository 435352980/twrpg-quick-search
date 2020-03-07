import React, { FC, useCallback } from 'react';
import { CardHeader, CardContent, Typography, Avatar } from '@material-ui/core';
import { useStoreActions, useStoreState } from '@renderer/store';
import TipPanel from '@renderer/components/GamePanel';
import IconImage from '@renderer/components/IconImage';
import styled from '@emotion/styled';
import { Good, Unit, ObjDisplayInfo } from '@renderer/dataHelper/types';
import local from '@renderer/local';
import CyanTooltip from '@renderer/components/CyanTooltip';
import DBHelper from '@renderer/dataHelper/dbHelper';
import DataHelper from '@renderer/dataHelper';
import { message } from '@renderer/helper';
import BossInfoPanel from './BossInfoPanel';
import GoodInfoPanel from './GoodInfoPanel';

const ObjAvator = styled(Avatar)<{ size?: number }>`
  ${({ size }) => (size ? `width:${size}px;height:${size}px;` : '')}
  cursor: pointer;
`;

const LimitContent = styled.div`
  max-width: 560px;
  margin-bottom: 4px;
`;

interface IntroProps {
  id: string;
  doCopy: (name: string) => void;
  doExport: (name: string) => void;
}

const Intro: FC<IntroProps> = ({ id, doCopy, doExport }) => {
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const addCacheId = useStoreActions(actions => actions.good.addCacheId);
  const selectedTarget = useStoreState(state => state.common.selectedTarget);
  const addTargetItem = useStoreActions(actions => actions.common.addTargetItem);

  const setDetailView = useStoreActions(actions => actions.view.setDetailView);

  const [data, type] = dataHelper.getObjAndTypeById(id);
  const handleCopy = useCallback(() => doCopy(data.name), [data.name, doCopy]);
  const handleExport = useCallback(() => doExport(data.name), [data.name, doExport]);

  const handleImgClick = useCallback(
    ({ id }: ObjDisplayInfo) => {
      setDetailView({ id });
    },
    [setDetailView],
  );
  const handleImgContextMenu = useCallback(
    ({ id, name }: ObjDisplayInfo) => {
      const [, type] = dataHelper.getObjAndTypeById(id);
      if (type === 'good') {
        if (selectedTarget) {
          addTargetItem(id);
          message.success(`${name}${local.COMMON.ADD_TO_TARGET}【${selectedTarget.name}】`);
        } else {
          addCacheId(id);
          message.success(`${name}${local.COMMON.ADD_TO_CACHE}`);
        }
      }
    },
    [addCacheId, addTargetItem, dataHelper, selectedTarget],
  );

  if (!id) {
    return <div />;
  }

  return (
    <>
      <CardHeader
        avatar={
          <ObjAvator
            size={40}
            src={data.imgData}
            onClick={() => {
              console.log('aaa');
              handleCopy();
            }}
            onContextMenu={handleExport}
          />
        }
        title={
          <Typography variant="body1">
            {data.name}
            {/* 物品与BOSS拥有阶段 */}
            {data.stage && (
              <Typography variant="body1" component="span" color="secondary">
                {local.COMMON.STAGES[data.stage]}
              </Typography>
            )}
          </Typography>
        }
        subheader={
          (type === 'good'
            ? `${data.level || ''} ${
                local.COMMON.QUALITIES[data.quality] ? local.COMMON.QUALITIES[data.quality] : ''
              }`
            : '') +
          (type === 'unit' ? local.COMMON.UNIT : '') +
          (type === 'hero' ? local.COMMON.HERO : '')
        }
      />
      <CardContent>
        {/* 限定信息 */}
        {data.limitHeroes && (
          <LimitContent>
            <Typography variant="subtitle1" color="secondary">
              佩戴限定
            </Typography>
            {data.limitHeroes.map(({ name, imgData }, index) => {
              return (
                <CyanTooltip key={index} title={name} placement="top">
                  <IconImage size={40} src={imgData} />
                </CyanTooltip>
              );
            })}
          </LimitContent>
        )}
        {/* 物品说明 */}
        {type === 'good' && (
          <TipPanel
            style={{ fontSize: '1rem' }}
            desc={
              (data.displayName || data.name) + data.desc + '\n|c00ffff00' + (data.effect || '')
            }
          />
        )}
        {/* 装备关联 */}
        <GoodInfoPanel
          data={data as Good}
          dataHelper={dataHelper as DataHelper}
          handleImgClick={handleImgClick}
          handleImgContextMenu={handleImgContextMenu}
        />
        {/* Boss关联 */}
        {type === 'unit' && (
          <BossInfoPanel
            data={data as Unit}
            dataHelper={dataHelper as DataHelper}
            handleImgClick={handleImgClick}
            handleImgContextMenu={handleImgContextMenu}
          />
        )}
      </CardContent>
    </>
  );
};

export default Intro;
