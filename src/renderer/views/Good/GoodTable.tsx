import React, { useMemo, useState } from 'react';
import { Typography, Button, Avatar } from '@material-ui/core';
import ReactTooltip from 'react-tooltip';
import { Table, Column } from 'react-virtualized';

import clsx from 'clsx';
import orderBy from 'lodash/orderBy';

import useStyles from './style';
import { getDb, getImage } from '@/db';
import { useStoreState, useStoreActions } from '@/store';
import useWindowSize from '@/hooks/useWindowSize';
import Cell from '@/components/Cell';
import FeaturesSelect from '@/components/FeaturesSelect';
import HeroSelect from '@/components/HeroSelect';
import goodFieldsConfig from '@/configs/goodFieldsConfig';
import { formatTipString, getAnchor } from '@/utils/common';

const source = getDb('goods').getAll();
const descSort = (key: keyof Good) => (good: Good) => (good[key] ? good[key] : -1);
const ascSort = (key: keyof Good) => (good: Good) => (good[key] ? good[key] : 99);

/**
 * 根据特性ID筛选物品
 * @param list 物品列表
 * @param featureKeys 特性ID列表
 */
const filterFeatures = (list: Good[], featureKeys: (keyof Good)[]) =>
  featureKeys.length > 0
    ? list.filter(good =>
        featureKeys.every(key => !!good[key] || (!good.goodType || good.goodType > 5)),
      )
    : list;

/**
 * 根据英雄ID筛选物品
 * @param list 物品列表
 * @param limitHeroKeys 英雄ID列表
 */
const filterLimit = (list: Good[], limitHeroKeys: string[]) =>
  limitHeroKeys.length > 0
    ? list.filter(good => {
        const limit = good.limit;
        return (
          !limit ||
          limit.find(info => limitHeroKeys.includes(info.id)) ||
          (!good.goodType || good.goodType > 5)
        );
      })
    : list;

/**
 * 根据专属ID筛选物品
 * @param list 物品列表
 * @param exclusiveHeroKeys 专属ID列表
 */
const filterExclusive = (list: Good[], exclusiveHeroKeys: string[]) =>
  exclusiveHeroKeys.length > 0
    ? list.filter(good => {
        const exclusive = good.exclusive;
        return (
          (exclusive &&
            exclusive.length > 0 &&
            exclusive.find(info => exclusiveHeroKeys.includes(info.id))) ||
          (!good.goodType || good.goodType > 5)
        );
      })
    : list;

const GoodTable = () => {
  const classes = useStyles();
  const { innerWidth, innerHeight } = useWindowSize();

  const [heroLimitFilter, setHeroLimitFilter] = useState<string[]>([]);
  const [exclusiveHeroFilter, setExclusiveHeroFilter] = useState<string[]>([]);
  const [featureFilter, setFeatureFilter] = useState<(keyof Good)[]>([]);

  const cacheIds = useStoreState(state => state.good.cacheIds);
  const useMust = useStoreState(state => state.good.useMust);
  const filterStage = useStoreState(state => state.good.filterStage);
  const filterText = useStoreState(state => state.good.filterText);
  const filterCat = useStoreState(state => state.good.filterCat);
  const showCache = useStoreState(state => state.good.showCache);

  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const setSplitView = useStoreActions(actions => actions.view.setSplitView);
  const setUpgradeView = useStoreActions(actions => actions.view.setUpgradeView);
  const setCalcView = useStoreActions(actions => actions.view.setCalcView);

  const addCacheId = useStoreActions(actions => actions.good.addCacheId);

  const goods = useMemo(() => {
    let result =
      showCache && cacheIds.length > 0
        ? cacheIds.map(id => getDb('goods').find('id', id))
        : orderBy(
            source.filter(
              ({ name, stage, cat = [], goodType, ignorable }) =>
                (useMust ? !ignorable : true) &&
                (filterText ? name.includes(filterText) : true) &&
                (filterCat ? cat.includes(filterCat) : true) &&
                (filterStage ? stage === filterStage || !goodType || goodType > 6 : true),
            ),
            [ascSort('goodType'), descSort('stage'), descSort('level'), descSort('quality')],
            ['asc', 'desc', 'desc', 'desc'],
          );

    result = filterExclusive(result, exclusiveHeroFilter);
    result = filterLimit(result, heroLimitFilter);
    result = filterFeatures(result, featureFilter);
    return result;
  }, [
    heroLimitFilter,
    exclusiveHeroFilter,
    featureFilter,
    useMust,
    filterStage,
    filterText,
    filterCat,
    showCache,
    cacheIds,
  ]);

  return (
    <>
      <Table
        className={classes.table}
        headerClassName={classes.header}
        width={innerWidth}
        height={innerHeight - 264}
        headerHeight={40}
        rowHeight={64}
        rowCount={goods.length}
        rowStyle={{ alignItems: 'stretch' }}
        rowGetter={({ index }) => goods[index]}
        onScroll={() => ReactTooltip.hide()}
      >
        <Column
          label="操作"
          dataKey="operation"
          width={80}
          cellRenderer={({ rowData }) => {
            const { id } = rowData as Good;
            return (
              <Cell>
                <div className={classes.btnsCell}>
                  <Button
                    disableRipple
                    variant="contained"
                    color="primary"
                    className={classes.operationBtn}
                    onClick={() => setSplitView({ show: true, id })}
                  >
                    拆解
                  </Button>
                  <Button
                    disableRipple
                    variant="contained"
                    color="primary"
                    className={classes.operationBtn}
                    onClick={() => setUpgradeView({ show: true, id })}
                  >
                    进阶
                  </Button>
                </div>
              </Cell>
            );
          }}
        ></Column>
        <Column
          label="图片"
          dataKey="img"
          width={64}
          cellRenderer={({ rowData }) => {
            const { id, name, img } = rowData as Good;
            return (
              <Cell
                className={classes.pointerCell}
                onClick={e => setDetailView({ isGood: true, id, show: true, anchor: getAnchor(e) })}
                onContextMenu={() => addCacheId(id)}
              >
                <img className={classes.img} alt={name} src={getImage(img)} />
              </Cell>
            );
          }}
        ></Column>
        <Column
          label="物品名称"
          dataKey="name"
          width={240}
          headerRenderer={() => (
            <Cell className={classes.dropDownCell}>
              <HeroSelect
                placeholder="佩戴限定"
                onChange={(keys: string[]) => setHeroLimitFilter(keys)}
              />
            </Cell>
          )}
          cellRenderer={({ cellData }) => (
            <Cell>
              <Typography variant="body1" align="center">
                {cellData}
              </Typography>
            </Cell>
          )}
        ></Column>
        <Column
          label="等级"
          dataKey="level"
          width={80}
          cellRenderer={({ cellData }) => (
            <Cell>
              <Typography variant="body1" align="center">
                {cellData}
              </Typography>
            </Cell>
          )}
        ></Column>
        <Column
          label="品阶(明细)"
          dataKey="level"
          width={106}
          cellRenderer={({ rowData }) => {
            const { name, desc, effect = '', qualityString } = rowData as Good;
            return (
              <Cell
                data-place="top"
                data-for="infoTip"
                data-tip={formatTipString(name, desc, effect)}
                onMouseEnter={() => ReactTooltip.rebuild()}
              >
                <Typography variant="body1" align="center">
                  {qualityString}
                </Typography>
              </Cell>
            );
          }}
        ></Column>
        <Column
          label="限定"
          dataKey="limit"
          width={60}
          cellRenderer={({ rowData }) => {
            const { limit } = rowData as Good;
            const hasTip = !!limit;
            return (
              <Cell>
                <Typography
                  variant="body1"
                  align="center"
                  className={clsx({ [classes.redCell]: hasTip })}
                >
                  {hasTip ? '有' : null}
                </Typography>
              </Cell>
            );
          }}
        ></Column>
        <Column
          label="专属"
          dataKey="exclusive"
          width={170}
          headerRenderer={() => (
            <Cell className={classes.dropDownCell}>
              <HeroSelect
                placeholder="专属"
                onChange={(keys: string[]) => setExclusiveHeroFilter(keys)}
              />
            </Cell>
          )}
          cellRenderer={({ rowData }) => {
            const { exclusive } = rowData as Good;
            return (
              <Cell>
                {exclusive &&
                  exclusive.map(info => {
                    return (
                      <img
                        data-for="infoTip"
                        data-tip={formatTipString(info.name, info.on, info.desc)}
                        data-place="top"
                        onMouseEnter={() => ReactTooltip.rebuild()}
                        alt={info.name}
                        className={classes.img}
                        key={info.id}
                        src={getImage(info.img)}
                      />
                    );
                  })}
              </Cell>
            );
          }}
        ></Column>
        <Column
          label="特性"
          dataKey="overView"
          width={464}
          flexGrow={1}
          headerRenderer={() => {
            return (
              <Cell className={classes.dropDownCell}>
                <FeaturesSelect onChange={keys => setFeatureFilter(keys)} />
              </Cell>
            );
          }}
          cellRenderer={({ rowData }) => {
            const overView = Object.entries(goodFieldsConfig).reduce(
              (acc: React.ReactNode[], [key, name]) => {
                const value = (rowData as Good)[key as keyof Good] as number;
                if (value) {
                  acc.push(
                    <div
                      key={key}
                      data-for="overViewTip"
                      data-tip={value}
                      data-offset={"{'top':-8}"}
                      onMouseEnter={() => ReactTooltip.rebuild()}
                      className={classes.avatorTipTrigger}
                    >
                      <Avatar className={value > 0 ? classes.avator : classes.avatorRed}>
                        {name}
                      </Avatar>
                    </div>,
                  );
                }
                return acc;
              },
              [],
            );
            return <Cell>{overView}</Cell>;
          }}
        ></Column>
        <Column
          label="阶段/计算"
          dataKey="extraOperation"
          width={88}
          cellRenderer={({ rowData }) => {
            const { id } = rowData as Good;
            return (
              <Cell
                className={classes.pointerCell}
                onClick={e =>
                  setCalcView({ show: true, ids: [id], haves: [], anchor: getAnchor(e) })
                }
              >
                <Typography variant="body1" color="secondary" align="center">
                  {(rowData as Good).stageDesc || '其他'}
                </Typography>
              </Cell>
            );
          }}
        ></Column>
      </Table>
      <ReactTooltip
        id="infoTip"
        effect="solid"
        place="right"
        type="warning"
        multiline
        className={classes.infoTip}
      />

      <ReactTooltip
        id="heroLimitTip"
        effect="solid"
        place="top"
        type="warning"
        multiline
        className={classes.heroLimitTip}
        getContent={dataTip =>
          dataTip
            ? JSON.parse(dataTip).map((limit: Limit) => {
                return <img key={`limit-${limit.id}`} alt={limit.name} src={getImage(limit.img)} />;
              })
            : null
        }
      />

      <ReactTooltip
        id="overViewTip"
        effect="solid"
        place="top"
        type="warning"
        multiline
        className={classes.overViewTip}
      />
    </>
  );
};

export default GoodTable;
