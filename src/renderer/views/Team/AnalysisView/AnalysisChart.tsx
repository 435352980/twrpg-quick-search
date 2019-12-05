/* eslint-disable no-shadow  */
/* eslint-disable react-hooks/exhaustive-deps  */
import React, { useState, useEffect, FC } from 'react';
import { makeStyles } from '@material-ui/core';
import { grey, cyan, red } from '@material-ui/core/colors';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Grid, Paper, Typography, Avatar } from '@material-ui/core';
import { Table, Column, Cell } from 'fixed-data-table-2';

import ReactTooltip from 'react-tooltip';

import { diffRequireInfo } from './requireUtil';
import useWindowSize from '@/hooks/useWindowSize';
import DropList from '@/components/DropList';
import { getDb, getImage } from '@/db';
import { reorder, getAnchor } from '@/utils/common';
import { blueTip, textAvatorCyan, textAvatorRed } from '@/theme/common';
import { useStoreActions } from '@/store';
import ColorBtn from '@/components/ColorBtn';
import Footer from '@/views/Footer';

// import Footer from '../../Footer';

const getName = (id: string) => getDb('goods').find('id', id).name;

const useStyles = makeStyles({
  quickBtnRoot: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    background: grey['100'],
    // marginTop: theme.spacing.unit * 2,
    marginBottom: 16,
    // padding: 8
    marginTop: 64,
  },
  quickBtn: { margin: 4, flex: 1, boxShadow: 'none' },
  tableRow: {
    userSelect: 'none',
    '&:hover .public_fixedDataTableCell_main': { backgroundColor: '#e3f1fd' },
  },
  tableHeader: {
    background: '#00bcd4',
    color: 'white',
    textAlign: 'center',
    fontSize: '1rem',
    userSelect: 'none',
  },
  imageCell: { cursor: 'pointer', '& img': { width: 48, height: 48 } },
  requireCell: { display: 'flex', '& img': { width: 48, height: 48 } },
  playerRequire: {
    display: 'flex',
    alignItems: 'center',
    width: 112,
    // float: 'left',
  },
  palyerRequireRoot: {
    // display: 'flex',
    // alignItems: 'center',
    width: 112,
    marginRight: 8,
    backgroundColor: '#6fcaddbf',
    // flexDirection: 'column',
    float: 'left',
  },
  avator: { ...textAvatorCyan, width: 64, borderRadius: 0 },
  bossesTip: {
    zIndex: ('9999!important' as unknown) as number,
    color: '#000!important',
    ...blueTip,
    '& img': { width: 48, height: 48, margin: 2 },
  },
  dropInfoTip: {
    display: 'flex',
    alignItems: 'center',
  },
  dropInfoTextRoot: {
    display: 'flex',
    flexDirection: 'column',
  },
  img: {
    width: 64,
    height: 64,
  },
});

interface AnalysisViewProps {
  players: Player[];
}

const AnalysisView: FC<AnalysisViewProps> = ({ players = [] }) => {
  const classes = useStyles();
  const [bossIds, setBossIds] = useState<string[]>([]);
  const [excludeBossIds, setExcludeBossIds] = useState<string[]>([]);
  const { innerWidth, innerHeight } = useWindowSize();

  const setDetailView = useStoreActions(actions => actions.view.setDetailView);

  const allRequire = players.reduce(
    (
      acc: {
        sumCount: { [key: string]: number };
        chooseCount: { [key: string]: number };
        refBosses: string[];
      },
      player: Player,
    ) => {
      const { target, panel, bag } = player;
      const { sumCount, chooseCount } = diffRequireInfo(target, panel.concat(bag));
      Object.keys(sumCount).forEach(id => {
        const { dropFrom = [] } = getDb('goods').find('id', id);
        acc.sumCount[id] = (acc.sumCount[id] || 0) + sumCount[id];
        acc.refBosses = [...new Set([...acc.refBosses, ...dropFrom.map(dp => dp.id)])];
      });
      Object.keys(chooseCount).forEach(id => {
        acc.chooseCount[id] = (acc.chooseCount[id] || 0) + chooseCount[id];
      });
      return acc;
    },
    { sumCount: {}, chooseCount: {}, refBosses: [] },
  );
  useEffect(() => {
    const bossIds = allRequire.refBosses.sort(
      (a, b) => getDb('units').findIndex('id', b) - getDb('units').findIndex('id', a),
    );
    setBossIds(bossIds);
    setExcludeBossIds([]);
  }, [allRequire.refBosses.toString(), players.map(player => player.id).toString()]);
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const { draggableId, source, destination } = result;

    const addId = draggableId.split('|')[1];

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'boss_source') {
        setBossIds(reorder(bossIds, source.index, destination.index));
      } else {
        setExcludeBossIds(reorder(excludeBossIds, source.index, destination.index));
      }
    } else if (source.droppableId === 'boss_source') {
      setBossIds(bossIds.filter((id, i) => i !== source.index));
      const toArr = Array.from(excludeBossIds);
      toArr.splice(destination.index, 0, addId);
      setExcludeBossIds(toArr);
    } else {
      setExcludeBossIds(excludeBossIds.filter((id, i) => i !== source.index));
      const toArr = Array.from(bossIds);
      toArr.splice(destination.index, 0, addId);
      setBossIds(toArr);
    }
  };

  // 取交集
  const xAxisData = Object.keys(allRequire.sumCount)
    .filter(id =>
      bossIds
        .reduce(
          (acc: string[], id) => [
            ...new Set(acc.concat((getDb('units').find('id', id).drop || []).map(({ id }) => id))),
          ],
          [],
        )
        .includes(id),
    )
    .sort((a, b) => allRequire.sumCount[b] - allRequire.sumCount[a]);

  // const { series, legendData } = players.reduce(
  //   (acc, player, index) => {
  //     const {
  //       name, target, panel, bag,
  //     } = player;
  //     const { sumCount, chooseCount } = diffRequireInfo(target, panel.concat(bag));
  //     acc.legendData.push(name);
  //     acc.series.push({
  //       name,
  //       type: 'bar',
  //       barMaxWidth: 80,
  //       stack: 'count',
  //       data: xAxisData.map(id => (sumCount[id] ? sumCount[id] : 0)),
  //       chooseCount,
  //     });
  //     return acc;
  //   },
  //   { series: [], legendData: [] },
  // );

  const catBtnClick = (stageValue: number) => {
    const { bossIds, excludeBossIds } = allRequire.refBosses.reduce(
      (acc: { bossIds: string[]; excludeBossIds: string[] }, bossId) => {
        if (getDb('units').find('id', bossId).stage === stageValue) {
          acc.bossIds.push(bossId);
        } else {
          acc.excludeBossIds.push(bossId);
        }
        return acc;
      },
      { bossIds: [], excludeBossIds: [] },
    );
    setBossIds(bossIds);
    setExcludeBossIds(excludeBossIds);
  };

  return (
    <>
      <Paper elevation={0} className={classes.quickBtnRoot}>
        <ColorBtn
          variant="contained"
          color="blue"
          className={classes.quickBtn}
          onClick={() => {
            const bossIds = allRequire.refBosses.sort(
              (a, b) => getDb('units').findIndex('id', b) - getDb('units').findIndex('id', a),
            );
            setBossIds(bossIds);
            setExcludeBossIds([]);
          }}
        >
          重置
        </ColorBtn>

        <ColorBtn
          variant="contained"
          color="blue"
          className={classes.quickBtn}
          onClick={() => catBtnClick(6)}
        >
          白怨火
        </ColorBtn>

        <ColorBtn
          variant="contained"
          color="blue"
          className={classes.quickBtn}
          onClick={() => catBtnClick(5)}
        >
          主龙
        </ColorBtn>

        <ColorBtn
          variant="contained"
          color="blue"
          className={classes.quickBtn}
          onClick={() => catBtnClick(4)}
        >
          四大
        </ColorBtn>

        <ColorBtn
          variant="contained"
          color="blue"
          className={classes.quickBtn}
          onClick={() => catBtnClick(3)}
        >
          小四
        </ColorBtn>

        <ColorBtn
          variant="contained"
          color="blue"
          className={classes.quickBtn}
          onClick={() => catBtnClick(2)}
        >
          粉末
        </ColorBtn>
        <ColorBtn
          variant="contained"
          color="blue"
          className={classes.quickBtn}
          onClick={() => catBtnClick(1)}
        >
          野外
        </ColorBtn>
      </Paper>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container direction="row">
          <Grid item xs={6} style={{ padding: '0px 8px' }}>
            <DropList
              droppableId="boss_source"
              list={bossIds.map(unitId => {
                const { id, name, img } = getDb('units').find('id', unitId);
                return { id, name, img };
              })}
              size="large"
              onItemClick={(id, e) =>
                setDetailView({ id, show: true, isGood: false, anchor: getAnchor(e) })
              }
              onItemContextMenu={(id, index) => {
                setBossIds(bossIds.filter((id, i) => i !== index));
                setExcludeBossIds([...excludeBossIds, id]);
                // console.log(id, index);
              }}
            />
          </Grid>
          <Grid item xs={6} style={{ padding: '0px 8px' }}>
            <DropList
              droppableId="boss_exclude"
              list={excludeBossIds.map(unitId => {
                const { id, name, img } = getDb('units').find('id', unitId);
                return { id, name, img };
              })}
              onItemClick={(id, e) =>
                setDetailView({ id, show: true, isGood: false, anchor: getAnchor(e) })
              }
              onItemContextMenu={(id, index) => {
                setExcludeBossIds(excludeBossIds.filter((id, i) => i !== index));
                setBossIds([...bossIds, id]);
                // console.log(id, index);
              }}
            />
          </Grid>
        </Grid>
      </DragDropContext>

      <Table
        width={innerWidth}
        height={innerHeight - 259}
        headerHeight={40}
        rowHeight={88}
        rowsCount={xAxisData.length}
        rowClassNameGetter={() => classes.tableRow}
        onScrollStart={() => ReactTooltip.hide()}
      >
        <Column
          align="center"
          fixed
          width={64}
          header={props => (
            <Cell className={classes.tableHeader} {...props}>
              图片
            </Cell>
          )}
          cell={props => {
            const good = getDb('goods').find('id', xAxisData[props.rowIndex]);
            const { id, name, img } = good;
            return (
              <Cell
                {...props}
                className={classes.imageCell}
                onClick={e =>
                  setDetailView({
                    isGood: true,
                    id,
                    show: true,
                    anchor: getAnchor(e),
                  })
                }
              >
                <img className={classes.img} alt={name} src={getImage(img)} />
              </Cell>
            );
          }}
        />
        <Column
          align="center"
          fixed
          width={240}
          header={props => (
            <Cell className={classes.tableHeader} {...props}>
              材料名称
            </Cell>
          )}
          cell={props => (
            <Cell {...props}>
              <Typography variant="body1">{getName(xAxisData[props.rowIndex])}</Typography>
            </Cell>
          )}
        />
        <Column
          align="center"
          fixed
          width={120}
          header={props => (
            <Cell className={classes.tableHeader} {...props}>
              总需求
            </Cell>
          )}
          cell={props => {
            const id = xAxisData[props.rowIndex];
            const sum = allRequire.sumCount[id];
            const choose = allRequire.chooseCount[id];
            const text = choose ? `${sum}(?-${choose})` : sum;
            const good = getDb('goods').find('id', xAxisData[props.rowIndex]);
            return (
              <Cell
                {...props}
                data-tip={JSON.stringify(good.dropFrom)}
                onMouseEnter={() => ReactTooltip.rebuild()}
              >
                <Typography variant="body1" color="secondary">
                  {text}
                </Typography>
              </Cell>
            );
          }}
        />
        <Column
          flexGrow={1}
          width={64}
          header={props => (
            <Cell {...props} className={classes.tableHeader}>
              需求成员
            </Cell>
          )}
          cell={props => (
            <Cell {...props} className={classes.requireCell}>
              {players.reduce((acc: React.ReactNode[], player: Player, index) => {
                const { heroId, name, target, panel, bag } = player;
                const { sumCount, chooseCount } = diffRequireInfo(target, panel.concat(bag));

                const id = xAxisData[props.rowIndex];
                const sum = sumCount[id] || null;
                const choose = chooseCount[id];
                const text = choose ? `${sum}(?-${choose})` : sum;
                if (sum) {
                  acc.push(
                    <div className={classes.palyerRequireRoot} key={index}>
                      <Typography align="center" noWrap={true}>
                        {name}
                      </Typography>
                      <div
                        className={classes.playerRequire}
                        // data-tip={name}
                        // data-for="heroNameTip"
                      >
                        <img
                          key={index}
                          alt=""
                          src={getImage((getDb('heroes').find('id', heroId) || {}).img || 'BTNSpy')}
                          onMouseEnter={() => ReactTooltip.rebuild()}
                        />
                        <Avatar className={classes.avator}>{text}</Avatar>
                      </div>
                    </div>,
                  );
                }
                return acc;
              }, [])}
            </Cell>
          )}
        />
      </Table>
      <ReactTooltip
        place="top"
        type="warning"
        effect="solid"
        multiline
        className={classes.bossesTip}
        getContent={dataTip =>
          dataTip
            ? (JSON.parse(dataTip) as DropFrom[]).map(({ id, img, name, desc }, index) => (
                <div key={index} className={classes.dropInfoTip}>
                  <img alt={name} src={getImage(img)} />
                  <div className={classes.dropInfoTextRoot}>
                    <div>{name}</div>
                    <div>{`[${desc}]`}</div>
                  </div>
                </div>
              ))
            : null
        }
      />
      <ReactTooltip
        id="heroNameTip"
        place="top"
        type="warning"
        effect="solid"
        className={classes.bossesTip}
      />
      <Footer />
      {/* <ReactEcharts
        style={{ height: innerHeight - 144, width: '100%' }}
        theme="vintage"
        option={{
          grid: { bottom: '35%' },
          tooltip: {
            formatter: (params) => {
              const {
                seriesIndex, seriesName, name, dataIndex, value,
              } = params;
              const goodId = xAxisData[dataIndex];
              const { chooseCount } = series[seriesIndex];
              return `${seriesName}<br/>${name}:${value}${
                chooseCount[goodId] ? `(?-${chooseCount[goodId]})` : ''
              }<br/>总计:${allRequire.sumCount[goodId]}${
                allRequire.chooseCount[goodId] ? `(?-${allRequire.chooseCount[goodId]})` : ''
              }`;
            },
            textStyle: { fontSize: 24 },
          },
          dataZoom: [{ type: 'slider', showDetail: false }],
          xAxis: {
            type: 'category',
            name: '材料名称',
            data: xAxisData.map(id => getName(id)),
            axisLabel: { rotate: 40, interval: 0 },
            axisTick: { alignWithLabel: true },
          },
          yAxis: [{ type: 'value', minInterval: 1, name: '需求量' }],
          legend: { data: legendData },
          series,
        }}
        notMerge
        lazyUpdate
        onChartReady={() => console.log('ready')}
        // onEvents={EventsDict}
        // opts={}
      /> */}
    </>
  );
};

export default AnalysisView;
