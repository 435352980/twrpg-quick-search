import React, { useState, useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { Grid, Button, Drawer } from '@material-ui/core';
import { useStoreState, useStoreActions } from '@renderer/store';
import { message, confirm, getAnchor, reorder, simpleDeepCopy } from '@renderer/helper';
import useWindowSize from '@renderer/hooks/useWindowSize';
import PrintDialog from '@renderer/components/PrintDialog';
import Footer from '../Footer';
import TeamMemberInfo from './TeamMemberInfo';
import AddPlayerForm from './AddPlayerForm';
import MultiSplit from './MultiSplit';
import SelectPanel from './SelectPanel';
import AnalysisView from './AnalysisView';

const TeamView = () => {
  const { innerWidth, innerHeight } = useWindowSize();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [onWhich, setOnWhich] = useState<string | null>(null);
  const [showSelect, setShowSelect] = useState(false);

  const selectedTeam = useStoreState(state => state.common.selectedTeam);
  const setSelectedTeam = useStoreActions(actions => actions.common.setSelectedTeam);

  const setCalcView = useStoreActions(actions => actions.view.setCalcView);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);

  const [showAddDialog, setShowAddDialog] = useState(false);

  const [splitMembers, setSplitMembers] = useState<TeamMember[] | null>(null);
  const [showMultiSplit, setShowMultiSplit] = useState(false);

  const [analysisShow, setAnalysisShow] = useState(false);

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) {
      return;
    }
    const { draggableId, source, destination } = result;
    const [itemId] = draggableId.split('_');
    const copyMembers = simpleDeepCopy(members);

    if (source.droppableId === destination.droppableId) {
      const [memberId, where] = source.droppableId.split('_');
      const targetMember = copyMembers.find(m => m.id === memberId);

      targetMember[where] = reorder(
        targetMember[where as keyof TeamMember] as string[],
        source.index,
        destination.index,
      );

      setMembers(copyMembers);
      ipcRenderer.send('modifyTeamMember', targetMember);
    } else {
      const [memberId, from] = source.droppableId.split('_');
      console.log(from);
      const [, to] = destination.droppableId.split('_');

      const targetMember = copyMembers.find(m => m.id === memberId);

      targetMember[from].splice(source.index, 1);
      targetMember[to].splice(destination.index, 0, itemId);

      setMembers(copyMembers);

      ipcRenderer.send('modifyTeamMember', targetMember);
    }
  };

  const onUpdateTeamMembers = useCallback((event, members: TeamMember[]) => {
    setMembers(members);
  }, []);

  useEffect(() => {
    ipcRenderer.addListener('updateTeamMembers', onUpdateTeamMembers);
    return () => {
      ipcRenderer.removeListener('updateTeamMembers', onUpdateTeamMembers);
    };
  }, [onUpdateTeamMembers]);

  useEffect(() => {
    ipcRenderer.send('getTeamMembers', selectedTeam);
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
              setSplitMembers(members);
              setShowMultiSplit(true);
            }}
          >
            全员拆分
          </Button>
          <Button color="primary" onClick={() => setAnalysisShow(true)}>
            各成员需求分析图
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              confirm({
                title: '删除确认',
                content: `确认删除${selectedTeam}分组吗(考虑仔细哦)`,
                onOk: () => {
                  ipcRenderer.send('deleteTeam', selectedTeam);
                  setSelectedTeam('');
                },
              });
            }}
          >
            删除分组
          </Button>
        </Grid>
      </Grid>
      {members && (
        <div style={{ width: innerWidth, height: innerHeight - 170, overflowY: 'auto' }}>
          {members.map(member => (
            <TeamMemberInfo
              key={member.id}
              member={member}
              onPanelBtnClick={(playerId, type) => {
                setMemberId(playerId);
                setOnWhich(type);
                setShowSelect(true);
              }}
              handlePlayerDelete={() => {
                confirm({
                  title: '删除确认',
                  content: `确认删除${selectedTeam}分组成员${member.name}`,
                  onOk: () => ipcRenderer.send('deleteTeamMember', member.id),
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
              handleSplitClick={member => {
                setSplitMembers([member]);
                setShowMultiSplit(true);
              }}
              handleItemClick={(id, e) => {
                setDetailView({ id, show: true, anchor: getAnchor(e) });
              }}
              handleDrag={onDragEnd}
              handleItemRemove={member => {
                ipcRenderer.send('modifyTeamMember', member);
              }}
            />
          ))}
        </div>
      )}

      <AnalysisView
        members={members}
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
            const member = members.find(member => member.id === memberId) as TeamMember;
            const copyMember = simpleDeepCopy(member);
            copyMember[onWhich] = [...copyMember[onWhich], good.id];
            ipcRenderer.send('modifyTeamMember', copyMember);
            // this.setState({ [key]: [...this.state[key], obj.name] }, () =>
            message.success(
              `${good.name}已添加${`至${
                onWhich === 'panel' ? '面板' : onWhich === 'bag' ? '背包' : '目标'
              }`}`,
            );
            // )
          }}
        />
      </Drawer>
      <PrintDialog
        name={`分组【${selectedTeam || ''}】全体拆解`}
        show={showMultiSplit}
        onClose={() => setShowMultiSplit(false)}
      >
        {splitMembers && splitMembers.map(member => <MultiSplit key={member.id} member={member} />)}
      </PrintDialog>
      <AddPlayerForm
        show={showAddDialog}
        handleClose={() => setShowAddDialog(false)}
        handleSubmit={(addName, heroId) => {
          // console.log(addName, heroId);
          ipcRenderer.send('addTeamMember', {
            name: addName,
            teamName: selectedTeam,
            heroId,
          });
          setShowAddDialog(false);
        }}
      />
      <Footer />
    </>
  );
};

export default TeamView;
