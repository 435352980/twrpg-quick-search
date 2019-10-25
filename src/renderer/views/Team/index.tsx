import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';
import { ipcRenderer } from 'electron';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { Grid, Button, Drawer } from '@material-ui/core';
import { Modal, notification } from 'antd';
import PlayerInfo from './PlayerInfo';
import AddPlayerForm from './AddPlayerForm';
import MultiSplit from './MultiSplit';
import SelectPanel from './SelectPanel';
import AnalysisView from './AnalysisView';
import { useStoreState, useStoreActions } from '@/store';
import useWindowSize from '@/hooks/useWindowSize';
import { getAnchor, reorder } from '@/utils/common';
import PrintDialog from '@/components/PrintDialog';
import Footer from '@/views/Footer';

const Team: React.FC<RouteComponentProps> = () => {
  const { innerWidth, innerHeight } = useWindowSize();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectId, setSelectId] = useState<string | null>(null);
  const [selectType, setSelectType] = useState<string | null>(null);
  const [showSelect, setShowSelect] = useState(false);

  const selectedTeam = useStoreState(state => state.common.selectedTeam);
  const setSelectedTeam = useStoreActions(actions => actions.common.setSelectedTeam);

  const setCalcView = useStoreActions(actions => actions.view.setCalcView);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);

  const [showAddDialog, setShowAddDialog] = useState(false);

  const [splitPlayers, setSplitPlayers] = useState<Player[] | null>(null);
  const [showMultiSplit, setShowMultiSplit] = useState(false);

  const [analysisShow, setAnalysisShow] = useState(false);

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) {
      return;
    }
    const { draggableId, source, destination } = result;
    const name = draggableId.split('|')[1];

    if (source.droppableId === destination.droppableId) {
      const [id, where]: string[] = source.droppableId.split('_');
      const player = players.find(player => player.id === id) as Player;
      setPlayers(
        players.reduce((pre: Player[], curr: Player, index) => {
          if (curr.id === player.id) {
            return [
              ...pre,
              {
                ...curr,
                [where]: reorder(
                  player[where as keyof Player] as string[],
                  source.index,
                  destination.index,
                ),
              },
            ];
          }
          return [...pre, curr];
        }, []),
      );

      // return
      ipcRenderer.send('modifyPlayer', {
        ...player,
        [where]: reorder(
          player[where as keyof Player] as string[],
          source.index,
          destination.index,
        ),
      });
    } else {
      const [id, from] = source.droppableId.split('_');
      const to = destination.droppableId.split('_')[1];
      const player = players.find(player => player.id === id) as Player;
      const toArr = Array.from(player[to as keyof Player] as string[]);
      toArr.splice(destination.index, 0, name);
      setPlayers(
        players.reduce((pre: Player[], curr, index) => {
          if (curr.id === player.id) {
            return [
              ...pre,
              {
                ...curr,
                [from]: (player[from as keyof Player] as string[]).filter(
                  (obj, i) => i !== source.index,
                ),
                [to]: toArr,
              },
            ];
          }
          return [...pre, curr];
        }, []),
      );

      // return
      ipcRenderer.send('modifyPlayer', {
        ...player,
        [from]: (player[from as keyof Player] as string[]).filter((obj, i) => i !== source.index),
        [to]: toArr,
      });
    }
  };

  const onUpdatePlayers = useCallback((event, players: Player[]) => {
    // console.log(players);
    setPlayers(players);
  }, []);

  useEffect(() => {
    ipcRenderer.addListener('updatePlayers', onUpdatePlayers);
    return () => {
      ipcRenderer.removeListener('updatePlayers', onUpdatePlayers);
    };
  }, [onUpdatePlayers]);

  useEffect(() => {
    ipcRenderer.send('getPlayers', selectedTeam);
  }, [selectedTeam]);

  if (!selectedTeam) {
    return <div />;
  }

  return (
    <>
      <Grid container direction="column">
        <Grid
          container
          direction="row"
          alignItems="center"
          style={{ height: 32, overflow: 'hidden' }}
        >
          {/* <Button color="primary">全员分析</Button>
                    <Button color="primary">复制至剪切板</Button>
                    <Button color="primary">导出图片</Button> */}
          <div style={{ flex: 1 }} />
          <Button
            color="primary"
            onClick={() => {
              setShowAddDialog(true);
            }}
          >
            添加成员
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setSplitPlayers(players);
              setShowMultiSplit(true);
            }}
          >
            全员拆分
          </Button>
          {/* <Button color="primary">全员分析</Button> */}
          <Button color="primary" onClick={() => setAnalysisShow(true)}>
            各成员需求分析图
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              Modal.confirm({
                maskClosable: true,
                mask: false,
                okText: '确定',
                cancelText: '取消',
                okType: 'danger',
                onOk: () => {
                  ipcRenderer.send('deleteTeam', selectedTeam);
                  setSelectedTeam('');
                },
                title: '删除确认',
                content: `确认删除${selectedTeam}分组吗(考虑仔细哦)`,
              });
            }}
          >
            删除分组
          </Button>
        </Grid>
      </Grid>
      {players && (
        <div style={{ width: innerWidth, height: innerHeight - 160, overflowY: 'auto' }}>
          {players.map(player => (
            <PlayerInfo
              key={player.id}
              player={player}
              onPanelBtnClick={(playerId, type) => {
                setSelectId(playerId);
                setSelectType(type);
                setShowSelect(true);
              }}
              handlePlayerDelete={() => {
                Modal.confirm({
                  maskClosable: true,
                  mask: false,
                  okText: '确定',
                  cancelText: '取消',
                  okType: 'danger',
                  onOk: () => ipcRenderer.send('deletePlayer', player.id),
                  title: '删除确认',
                  content: `确认删除${selectedTeam}分组成员${player.name}`,
                });
              }}
              handleCalcClick={(targetIds, haveIds, e) => {
                setCalcView({
                  ids: targetIds,
                  haves: haveIds,
                  show: true,
                  anchor: getAnchor(e),
                });
              }}
              handleSplitClick={palyer => {
                setSplitPlayers([palyer]);
                setShowMultiSplit(true);
              }}
              handleItemClick={(id, e) => {
                setDetailView({ id, show: true, anchor: getAnchor(e) });
              }}
              handleDrag={onDragEnd}
              handleItemRemove={player => {
                ipcRenderer.send('modifyPlayer', player);
              }}
            />
          ))}
        </div>
      )}
      <Footer />
      <AnalysisView
        players={players}
        show={analysisShow}
        handleClose={() => setAnalysisShow(false)}
      />
      <Drawer
        BackdropProps={{ invisible: true }}
        anchor="right"
        open={showSelect}
        onClose={() => setShowSelect(false)}
      >
        <SelectPanel
          handleChange={good => {
            const player = players.find(player => player.id === selectId) as Player;

            ipcRenderer.send('modifyPlayer', {
              ...player,
              [selectType as 'panel' | 'bag' | 'dust']: [
                ...player[selectType as 'panel' | 'bag' | 'dust'],
                good.id,
              ],
            });
            // this.setState({ [key]: [...this.state[key], obj.name] }, () =>
            notification.success({
              duration: 1,
              placement: 'topLeft',
              message: '添加',
              description: `${good.name}已添加${`至${
                selectType === 'panel' ? '面板' : selectType === 'bag' ? '背包' : '目标'
              }`}`,
            });
            // )
          }}
        />
      </Drawer>
      <PrintDialog
        name={`分组【${selectedTeam || ''}】全体拆解`}
        show={showMultiSplit}
        onClose={() => setShowMultiSplit(false)}
      >
        {splitPlayers && splitPlayers.map(player => <MultiSplit key={player.id} player={player} />)}
      </PrintDialog>
      <AddPlayerForm
        show={showAddDialog}
        handleClose={() => setShowAddDialog(false)}
        handleSubmit={(addName, heroId) => {
          // console.log(addName, heroId);
          ipcRenderer.send('addPlayer', {
            team: selectedTeam,
            name: addName,
            heroId,
          });
          setShowAddDialog(false);
        }}
      />
    </>
  );
};

export default Team;
