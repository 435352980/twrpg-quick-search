import React, { useState, useEffect, FC } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Grid, Paper, Typography, Avatar } from '@mui/material';
import { WindowTable } from 'react-window-table';
import DropList from '@renderer/components/DropList';
import ColorBtn from '@renderer/components/ColorBtn';
import useWindowSize from '@renderer/hooks/useWindowSize';
import { reorder, getAnchor } from '@renderer/helper';
import { useStoreActions, useStoreState } from '@renderer/store';
import { CalcResult } from '@renderer/dataHelper/types';
import grey from '@mui/material/colors/grey';
import IconImage from '@renderer/components/IconImage';
import styled from '@emotion/styled';
import Footer from '@renderer/views/Footer';

interface AnalysisViewProps {
  members: TeamMember[];
}

const FuncPanel = styled(Paper)`
  display: flex;
  justify-content: center;
  width: 100%;
  background: ${grey['100']};
  margin-top: 64px;
`;

const MemberRequire = styled.div`
  float: left;
  width: 112px;
  margin-right: 8px;
  background-color: #6fcaddbf;
  div {
    display: flex;
    align-items: center;
  }
`;

const RequireAvator = styled(Avatar)`
  width: 64px;
  height: 48px;
  color: #616161;
  font-size: 1rem;
  background-color: #6fcaddbf;
  border-radius: 0;
`;

const AnalysisView: FC<AnalysisViewProps> = ({ members = [] }) => {
  const { innerWidth, innerHeight } = useWindowSize();
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const { goodDB, unitDB, heroDB } = dataHelper;

  const [bossIds, setBossIds] = useState<string[]>([]);
  const [excludeBossIds, setExcludeBossIds] = useState<string[]>([]);

  const setDetailView = useStoreActions(actions => actions.view.setDetailView);

  // 总合计
  const allCalc: Omit<CalcResult, 'unnecessarySum' | 'haveSum'> = {
    count: 0,
    requireSum: {},
    chooseGroupSum: {},
  };
  // 各成员单独合计
  const memberCalcs: (Omit<CalcResult, 'unnecessarySum'> & { member: TeamMember })[] = [];
  // 关联Boss合计
  let refBosses = [];
  // 处理总合计 各成员单独合计
  members.forEach(member => {
    const { target, panel, bag } = member;
    const { count, requireSum, chooseGroupSum, haveSum } = dataHelper.calcRequire(target, [
      ...panel,
      ...bag,
    ]);
    allCalc.count = (allCalc.count || 0) + count;
    Object.keys(requireSum).forEach(id => {
      allCalc.requireSum[id] = (allCalc.requireSum[id] || 0) + requireSum[id];
      refBosses = refBosses.concat(dataHelper.findRefBossesById(id));
    });
    Object.keys(chooseGroupSum).forEach(id => {
      allCalc.chooseGroupSum[id] = (allCalc.chooseGroupSum[id] || 0) + chooseGroupSum[id];
      refBosses = refBosses.concat(dataHelper.findRefBossesById(id));
    });
    memberCalcs.push({ member, count, requireSum, chooseGroupSum, haveSum });
  });
  const refBossIds = [...new Set(refBosses.map(refBoss => refBoss.id))].sort(
    (a, b) => unitDB.findIndex('id', b) - unitDB.findIndex('id', a),
  );

  // 切换阶段
  const onStageBtnClick = (stage: number) => {
    const bossIds = [];
    const excludeBossIds = [];
    unitDB.getListByFieldValues(refBossIds, 'id').forEach(unit => {
      if (unit.stage === stage) {
        bossIds.push(unit.id);
      } else {
        excludeBossIds.push(unit.id);
      }
    });
    setBossIds(bossIds);
    setExcludeBossIds(excludeBossIds);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const { draggableId, source, destination } = result;

    const [addId] = draggableId.split('_');

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

  // 根据选定的bossId计算当前需显示的物品
  const displayRequireRows: string[] = [];
  const displayChooseGroupRows: string[] = [];
  Object.keys(allCalc.requireSum).forEach(id => {
    if (dataHelper.findRefBossesById(id).some(unit => bossIds.includes(unit.id))) {
      displayRequireRows.push(id);
    }
  });
  Object.keys(allCalc.chooseGroupSum).forEach(id => {
    if (dataHelper.findRefBossesById(id).some(unit => bossIds.includes(unit.id))) {
      displayChooseGroupRows.push(id);
    }
  });

  useEffect(() => {
    setBossIds(refBossIds);
    setExcludeBossIds([]);

    // eslint-disable-next-line
  }, [refBossIds.toString(), unitDB]);

  return (
    <>
      <FuncPanel>
        <ColorBtn
          variant="contained"
          color="primary"
          onClick={() => {
            setBossIds(refBossIds);
            setExcludeBossIds([]);
          }}
        >
          {local.common.reset}
        </ColorBtn>

        {local.common.stages
          .filter(stage => !!stage)
          .map((stageName, index) => (
            <ColorBtn
              key={index}
              variant="contained"
              color="primary"
              onClick={() => onStageBtnClick(index + 1)}
            >
              {stageName}
            </ColorBtn>
          ))}
      </FuncPanel>

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container direction="row">
          <Grid item xs={6} style={{ padding: '0px 8px' }}>
            <DropList
              id="boss_source"
              list={unitDB.getListByFieldValues(bossIds, 'id')}
              imgSize={48}
              getDragItemProps={({ id }, index) => ({
                onClick: e =>
                  setDetailView({ id, show: true, isGood: false, anchor: getAnchor(e) }),
                onContextMenu: () => {
                  setBossIds(bossIds.filter((id, i) => i !== index));
                  setExcludeBossIds([...excludeBossIds, id]);
                },
              })}
            />
          </Grid>
          <Grid item xs={6} style={{ padding: '0px 8px' }}>
            <DropList
              id="boss_exclude"
              list={unitDB.getListByFieldValues(excludeBossIds, 'id')}
              imgSize={48}
              getDragItemProps={({ id }, index) => ({
                onClick: e =>
                  setDetailView({ id, show: true, isGood: false, anchor: getAnchor(e) }),
                onContextMenu: () => {
                  setBossIds([...bossIds, id]);
                  setExcludeBossIds(excludeBossIds.filter((id, i) => i !== index));
                },
              })}
            />
          </Grid>
        </Grid>
      </DragDropContext>
      <WindowTable
        cancelMouseMove={false}
        maxHeight={innerHeight - 240}
        // 按需求量排序
        rows={[
          ...displayRequireRows.sort((a, b) => allCalc.requireSum[b] - allCalc.requireSum[a]),
          ...displayChooseGroupRows.sort((a, b) => allCalc.requireSum[a] - allCalc.requireSum[b]),
        ]}
        rowCount={displayRequireRows.length + displayChooseGroupRows.length}
        rowHeight={index => (index > 0 ? 88 : 40)}
        columnCount={4}
        columnWidth={index => [128, 240, 120, innerWidth - 128 - 240 - 120 - 12][index]}
        minVisibleScrollViewWidth={0}
        minVisibleScrollViewHeight={0}
        fixedLeftCount={0}
        fixedTopCount={0}
        fixedRightCount={0}
        fixedBottomCount={0}
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
            name: 'image',
            label: local.views.team.image,
            textAlign: 'center',
            render: (cellData, goodId) => {
              return (
                <>
                  {goodDB.getListByFieldValues(goodId.split(','), 'id').map((good, index) => {
                    return (
                      <IconImage
                        key={good.id + index + 'image'}
                        size={48}
                        pointer
                        src={good.imgData}
                        onClick={e =>
                          setDetailView({ id: good.id, show: true, anchor: getAnchor(e) })
                        }
                      />
                    );
                  })}
                </>
              );
            },
          },
          {
            name: 'name',
            label: local.views.team.name,
            textAlign: 'center',
            render: (cellData, goodId) => {
              return (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {goodDB.getListByFieldValues(goodId.split(','), 'id').map((good, index) => {
                    return (
                      <Typography
                        variant="body1"
                        key={good.id + index + 'name'}
                        style={{ whiteSpace: 'normal' }}
                      >
                        {good.name}
                      </Typography>
                    );
                  })}
                </div>
              );
            },
          },
          {
            name: 'count',
            label: local.views.team.count,
            textAlign: 'center',
            render: (cellData, goodId) => (
              <Typography variant="body1" color="secondary">
                {allCalc.requireSum[goodId] || allCalc.chooseGroupSum[goodId]}
              </Typography>
            ),
          },
          {
            name: 'member',
            header: () => (
              <Typography variant="body1" align="center" style={{ width: '100%' }}>
                {local.views.team.member}
              </Typography>
            ),
            render: (cellData, goodId) => (
              <div
                style={{ display: 'flex', width: '100%', overflowX: 'auto', alignItems: 'center' }}
              >
                {memberCalcs.reduce((acc, memberCalc, index) => {
                  const { member, count, requireSum, chooseGroupSum, haveSum } = memberCalc;
                  if (requireSum[goodId] || chooseGroupSum[goodId]) {
                    acc.push(
                      <MemberRequire key={'member' + index + member.id}>
                        <Typography align="center" noWrap={true}>
                          {member.name}
                        </Typography>
                        <div>
                          <IconImage
                            size={48}
                            src={
                              heroDB.find('id', member.heroId)?.imgData ||
                              dataHelper.getImgData('BTNSpy')
                            }
                          />
                          <RequireAvator>
                            {requireSum[goodId] || chooseGroupSum[goodId]}
                          </RequireAvator>
                        </div>
                      </MemberRequire>,
                    );
                  }
                  return acc;
                }, [])}
              </div>
            ),
          },
        ]}
      />
      <Footer />
    </>
  );
};

export default AnalysisView;
