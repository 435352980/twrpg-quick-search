import React from 'react';

import { Grid, Button, Typography, Badge } from '@material-ui/core';
import { DragDropContext, ResponderProvided, DropResult } from 'react-beautiful-dnd';

import DropList from '@renderer/components/DropList';
import { useStoreState } from '@renderer/store';

interface MemberProps {
  member: TeamMember;
  onPanelBtnClick: (memberId: string, where: string) => void;
  handlePlayerDelete: (member: TeamMember) => void;
  handleCalcClick: (
    target: string[],
    have: string[],
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  handleSplitClick: (
    member: TeamMember,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  handleItemClick: (id: string, e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
  handleDrag: (result: DropResult, provided: ResponderProvided) => void;
  handleItemRemove: (member: TeamMember) => void;
}

const TeamMemberInfo: React.FC<MemberProps> = ({
  member,
  onPanelBtnClick,
  handlePlayerDelete,
  handleCalcClick,
  handleSplitClick,
  handleItemClick,
  handleDrag,
  handleItemRemove,
}) => {
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const { goodDB, heroDB } = dataHelper;
  const { target = [], panel = [], bag = [], store = [] } = member;
  const heroInfo = heroDB.find('id', member.heroId);
  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Grid>
        <Grid item xs={12} style={{ padding: '8px' }}>
          <Grid container direction="row" alignItems="center">
            <img style={{ width: 48, height: 48 }} src={heroInfo.imgData} />
            <Button
              color="primary"
              onClick={e => handleCalcClick(target, panel.concat(bag), e)}
              onContextMenu={e => {
                handleSplitClick(member, e);
              }}
            >
              <Typography variant="h5" color="inherit">
                {member.name}
              </Typography>
            </Button>
            <Badge badgeContent={member.panel.length} color="error">
              <Button color="primary" onClick={() => onPanelBtnClick(member.id, 'panel')}>
                面板
              </Button>
            </Badge>
            <Badge badgeContent={member.target.length} color="error">
              <Button color="primary" onClick={() => onPanelBtnClick(member.id, 'target')}>
                目标
              </Button>
            </Badge>
            <Badge badgeContent={member.bag.length} color="error">
              <Button color="primary" onClick={() => onPanelBtnClick(member.id, 'bag')}>
                背包
              </Button>
            </Badge>
            <Button disabled color="primary">
              <Typography color="inherit">{`创建日期：${member.time}`}</Typography>
            </Button>
            <div style={{ flex: 1 }} />
            <Button color="secondary" onClick={() => handlePlayerDelete(member)}>
              删除
            </Button>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item xs={6} style={{ padding: '0px 8px' }}>
            <DropList
              id={`${member.id}_panel`}
              list={goodDB.getListByFieldValues(member.panel, 'id')}
              imgSize={48}
              getDragItemProps={(good, index) => ({
                onClick: e => handleItemClick(good.id, e),
                onContextMenu: () =>
                  handleItemRemove({ ...member, panel: panel.filter((obj, i) => i !== index) }),
              })}
            />
          </Grid>
          <Grid item xs={6} style={{ padding: '0px 8px' }}>
            <DropList
              id={`${member.id}_target`}
              list={goodDB.getListByFieldValues(member.target, 'id')}
              imgSize={48}
              getDragItemProps={(good, index) => ({
                onClick: e => handleItemClick(good.id, e),
                onContextMenu: () =>
                  handleItemRemove({ ...member, target: target.filter((obj, i) => i !== index) }),
              })}
            />
          </Grid>
          <Grid item xs={12} style={{ padding: '0px 8px' }}>
            <DropList
              id={`${member.id}_bag`}
              list={goodDB.getListByFieldValues(member.bag, 'id')}
              imgSize={32}
              getDragItemProps={(good, index) => ({
                onClick: e => handleItemClick(good.id, e),
                onContextMenu: () =>
                  handleItemRemove({ ...member, bag: bag.filter((obj, i) => i !== index) }),
              })}
            />
          </Grid>
        </Grid>
      </Grid>
    </DragDropContext>
  );
};

export default TeamMemberInfo;
