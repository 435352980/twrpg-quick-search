import React, { FC, useState, useMemo } from 'react';
import { useStoreState, useStoreActions } from '@renderer/store';
import { useWindowSize } from '@renderer/hooks';
import IconImage from '@renderer/components/IconImage';
import WrapCell from '@renderer/components/WrapCell';
import { Typography, Button, Avatar } from '@material-ui/core';
import { Good, Exclusive } from '@renderer/dataHelper/types';
import GamePanel from '@renderer/components/GamePanel';
import orderBy from 'lodash/orderBy';
import { getAnchor, message } from '@renderer/helper';
import FeaturesSelect from '@renderer/components/FeaturesSelect';
import HeroSelect from '@renderer/components/HeroSelect';
import styled from '@emotion/styled';
import LiteTooltip from 'react-tooltip-lite';
import { WindowTable } from 'react-window-table';
import HeaderPanel from '@renderer/components/HeaderPanel';
import Footer from '../Footer';
import { filterExclusive, filterLimit, filterFeatures, goodDescSort, goodAscSort } from './util';

const BtnGrop = styled.div`
  display: flex;
  flex-direction: column;
`;

const OperationBtn = styled(Button)`
  color: #fff;
  padding: 0;
  min-height: 0;
  margin-bottom: 2px;
  background: linear-gradient(132deg, #68ade2 0, #55b0ff 100%);
  box-shadow: 0 1px 2px 1px rgba(33, 203, 243, 0.3);
`;

const OverViewAvator = styled(Avatar)<{ red?: string }>`
  width: 48px;
  height: 48px;
  color: ${({ red }) => (red === 'true' ? '#fefefe' : '#616161')};
  font-size: 1rem;
  background-color: ${({ red }) => (red === 'true' ? '#f571ae' : '#6fcaddbf')};
`;

const AvatorTipTrigger = styled.div`
  padding-left: 4px;
  padding-right: 4px;
`;
const GoodTable: FC = () => {
  console.log('render-table');
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const { innerWidth, innerHeight } = useWindowSize();
  const { goodDB } = dataHelper;

  const [heroLimitFilter, setHeroLimitFilter] = useState<string[]>([]);
  const [exclusiveHeroFilter, setExclusiveHeroFilter] = useState<string[]>([]);
  const [featureFilter, setFeatureFilter] = useState<(keyof Good)[]>([]);

  const cacheIds = useStoreState(state => state.good.cacheIds);
  const selectedTarget = useStoreState(state => state.common.selectedTarget);

  const filterStage = useStoreState(state => state.good.filterStage);
  const filterText = useStoreState(state => state.good.filterText);
  const filterCat = useStoreState(state => state.good.filterCat);
  const showCache = useStoreState(state => state.good.showCache);

  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const setSplitView = useStoreActions(actions => actions.view.setSplitView);
  const setUpgradeView = useStoreActions(actions => actions.view.setUpgradeView);
  const setCalcView = useStoreActions(actions => actions.view.setCalcView);

  const addCacheId = useStoreActions(actions => actions.good.addCacheId);
  const addTargetItem = useStoreActions(actions => actions.common.addTargetItem);

  const tempIds = selectedTarget?.targets || cacheIds;

  const goods = useMemo(() => {
    let result =
      showCache && tempIds.length > 0
        ? tempIds.map(id => goodDB.find('id', id))
        : orderBy(
            goodDB
              .raw()
              .filter(
                ({ name = '', stage, cat = [] }) =>
                  (filterText ? name.toLowerCase().includes(filterText.toLowerCase()) : true) &&
                  (filterCat ? cat.includes(filterCat) : true) &&
                  (filterStage ? stage === filterStage : true),
              ),
            [
              goodAscSort('goodType'),
              goodDescSort('stage'),
              goodDescSort('level'),
              goodDescSort('quality'),
            ],
            ['asc', 'desc', 'desc', 'desc'],
          );

    result = filterExclusive(result, exclusiveHeroFilter);
    result = filterLimit(result, heroLimitFilter);
    result = filterFeatures(result, featureFilter);
    return result;
  }, [
    showCache,
    tempIds,
    goodDB,
    exclusiveHeroFilter,
    heroLimitFilter,
    featureFilter,
    filterText,
    filterCat,
    filterStage,
  ]);

  // 剥离header
  const headers = useMemo(
    () => (
      <HeaderPanel
        width={innerWidth}
        height={40}
        cells={[
          { width: 80, label: local.views.good.operations },
          { width: 64, label: local.views.good.image },
          {
            width: 240,
            render: () => (
              <HeroSelect
                placeholder={local.views.good.heroLimit}
                onChange={(keys: string[]) => setHeroLimitFilter(keys)}
              />
            ),
          },
          { width: 80, label: local.views.good.level },
          { width: 106, label: local.views.good.quality },
          { width: 60, label: local.views.good.limit },
          {
            width: 170,
            render: () => (
              <HeroSelect
                placeholder={local.views.good.exclusives}
                onChange={(keys: string[]) => setExclusiveHeroFilter(keys)}
              />
            ),
          },
          {
            width: innerWidth - 900,
            render: () => <FeaturesSelect onChange={keys => setFeatureFilter(keys)} />,
          },
          { width: 88, label: local.views.good.calc },
        ]}
      />
    ),
    [
      innerWidth,
      local.views.good.calc,
      local.views.good.exclusives,
      local.views.good.heroLimit,
      local.views.good.image,
      local.views.good.level,
      local.views.good.limit,
      local.views.good.operations,
      local.views.good.quality,
    ],
  );

  return (
    <>
      {headers}
      <WindowTable
        cancelMouseMove={false}
        maxHeight={innerHeight - 290}
        rows={goods}
        rowCount={goods.length}
        rowHeight={index => (index > 0 ? 64 : 0)}
        columnCount={9}
        columnWidth={index => [80, 64, 240, 80, 106, 60, 170, innerWidth - 900, 88][index]}
        minVisibleScrollViewWidth={0}
        minVisibleScrollViewHeight={0}
        theme={classNames => {
          return {
            [classNames.GUIDELINE_BOTTOM]: { height: '0!important' },
            [classNames.GUIDELINE_TOP]: { height: '0!important' },
            [classNames.GUIDELINE_RIGHT]: { height: '0!important' },
            [classNames.GUIDELINE_LEFT]: { height: '0!important' },

            [classNames.CELL]: {
              display: 'flex',
              fontSize: '1rem',
              padding: '0!important',
              borderRight: '2px solid #dedede',
              alignItems: 'center',
              lineHeight: '1.5',
              fontWeight: 400,
            },
            [classNames.HEADER]: { background: '#00bcd4 !important', color: 'white' },
            [classNames.ROW_EVEN]: { background: '#f6f7f8' },
          };
        }}
        columns={[
          {
            name: 'operation',
            textAlign: 'center',
            render: (cellData, good) => (
              <BtnGrop>
                <OperationBtn
                  disableRipple
                  variant="contained"
                  color="primary"
                  onClick={() => setSplitView({ show: true, id: good.id })}
                >
                  {local.common.split}
                </OperationBtn>
                <OperationBtn
                  disableRipple
                  variant="contained"
                  color="primary"
                  onClick={() => setUpgradeView({ show: true, id: good.id })}
                >
                  {local.common.upgrade}
                </OperationBtn>
              </BtnGrop>
            ),
          },
          {
            name: 'imgData',
            textAlign: 'center',
            render: (cellData, good) => (
              <WrapCell
                pointer
                onClick={e =>
                  setDetailView({ isGood: true, id: good.id, show: true, anchor: getAnchor(e) })
                }
                onContextMenu={() => {
                  if (selectedTarget) {
                    addTargetItem(good.id);
                    message.success(
                      `${good.name}${local.common.addedToTarget}【${selectedTarget.name}】`,
                    );
                  } else {
                    addCacheId(good.id);
                    message.success(`${good.name}${local.common.addedToCache}`);
                  }
                }}
              >
                <IconImage size={48} src={good.imgData} />
              </WrapCell>
            ),
          },
          {
            name: 'name',
            textAlign: 'center',
            render: name => (
              <Typography variant="body1" style={{ whiteSpace: 'normal' }}>
                {name}
              </Typography>
            ),
          },
          {
            name: 'level',
            textAlign: 'center',
            render: level => <Typography variant="body1">{level}</Typography>,
          },
          {
            name: 'quality',
            textAlign: 'center',
            render: (level, rowData) => {
              const { displayName, desc, effect = '', quality } = rowData;
              return (
                <LiteTooltip
                  direction="right"
                  arrow={false}
                  hoverDelay={0}
                  mouseOutDelay={0}
                  styles={{ width: '100%', height: '100%' }}
                  content={<GamePanel desc={displayName + desc + '\n|c00ffff00' + effect} />}
                >
                  <WrapCell>
                    <Typography variant="body1" align="center">
                      {quality ? local.common.qualities[quality] : null}
                    </Typography>
                  </WrapCell>
                </LiteTooltip>
              );
            },
          },
          {
            name: 'limit',
            textAlign: 'center',
            render: (cellData, rowData) => {
              const { limitHeroes } = rowData;
              const hasTip = !!limitHeroes;
              return (
                <LiteTooltip
                  direction="up"
                  arrow={false}
                  hoverDelay={0}
                  mouseOutDelay={0}
                  background="linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)"
                  content={
                    hasTip && (
                      <div style={{ maxWidth: 288 }}>
                        {limitHeroes.map(({ id, imgData }) => (
                          <IconImage float="left" size={48} key={id} src={imgData} />
                        ))}
                      </div>
                    )
                  }
                >
                  <WrapCell>
                    <Typography
                      variant="body1"
                      align="center"
                      color={hasTip ? 'secondary' : 'inherit'}
                    >
                      {hasTip ? local.views.good.have : null}
                    </Typography>
                  </WrapCell>
                </LiteTooltip>
              );
            },
          },
          {
            name: 'exclusives',
            render: (exclusives: Exclusive[]) => (
              <div
                style={{
                  paddingLeft: 8,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {exclusives &&
                  exclusives.map(info => {
                    return (
                      <LiteTooltip
                        key={info.id}
                        direction="up"
                        arrow={false}
                        hoverDelay={0}
                        mouseOutDelay={0}
                        content={
                          <GamePanel
                            desc={info.name + '\n' + info.on + '\n|c00ffff00' + info.desc}
                          />
                        }
                      >
                        <IconImage size={48} float="left" src={info.imgData} />
                      </LiteTooltip>
                    );
                  })}
              </div>
            ),
          },
          {
            name: 'overview',
            textAlign: 'left',
            render: (cellData, rowData) => {
              const overView = Object.entries(local.common.goodFields).reduce(
                (acc: React.ReactNode[], [key, name]) => {
                  const value = rowData[key as keyof Good] as number;
                  if (value) {
                    acc.push(
                      <LiteTooltip
                        styles={{ borderRadius: 8 }}
                        key={key}
                        direction="up"
                        arrow={false}
                        hoverDelay={0}
                        mouseOutDelay={0}
                        content={
                          <Typography variant="body1" align="center" style={{ minWidth: 72 }}>
                            {value}
                          </Typography>
                        }
                        background="linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)"
                      >
                        <AvatorTipTrigger>
                          <OverViewAvator red={(value < 0) + ''}>{name}</OverViewAvator>
                        </AvatorTipTrigger>
                      </LiteTooltip>,
                    );
                  }
                  return acc;
                },
                [],
              );
              return <>{overView}</>;
            },
          },
          {
            name: 'calc',
            textAlign: 'center',
            render: (cellData, rowData) => {
              const { id } = rowData;
              return (
                <WrapCell
                  pointer
                  onClick={e =>
                    setCalcView({ show: true, ids: [id], haves: [], anchor: getAnchor(e) })
                  }
                >
                  <Typography variant="body1" color="secondary" align="center">
                    {local.common.stages[rowData.stage] || local.common.otherType}
                  </Typography>
                </WrapCell>
              );
            },
          },
        ]}
      />
      <Footer showCalc />
    </>
  );
};

export default GoodTable;
