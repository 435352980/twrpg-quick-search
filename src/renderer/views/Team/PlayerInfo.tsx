import React from 'react';

import { Grid, Button, Typography, Badge } from '@material-ui/core';
import { DragDropContext, ResponderProvided, DropResult } from 'react-beautiful-dnd';

import { getDb, getImage } from '@/db';
import DropList from '@/components/DropList';

interface PlayerProps {
  player: Player;
  onPanelBtnClick: (playerId: string, where: string) => void;
  handlePlayerDelete: (player: Player) => void;
  handleCalcClick: (
    target: string[],
    have: string[],
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  handleSplitClick: (player: Player, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleItemClick: (id: string, e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
  handleDrag: (result: DropResult, provided: ResponderProvided) => void;
  handleItemRemove: (player: Player) => void;
}

const PlayerInfo: React.FC<PlayerProps> = ({
  player,
  onPanelBtnClick,
  handlePlayerDelete,
  handleCalcClick,
  handleSplitClick,
  handleItemClick,
  handleDrag,
  handleItemRemove,
}) => {
  const { target = [], panel = [], bag = [], store = [] } = player;
  const heroInfo = getDb('heroes').find('id', player.heroId);
  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Grid>
        <Grid item xs={12} style={{ padding: '8px' }}>
          <Grid container direction="row" alignItems="center">
            <img style={{ width: 48, height: 48 }} src={getImage(heroInfo.img)} />
            <Button
              color="primary"
              onClick={e => handleCalcClick(target, panel.concat(bag), e)}
              onContextMenu={e => {
                handleSplitClick(player, e);
              }}
            >
              <Typography variant="h5" color="inherit">
                {player.name}
              </Typography>
            </Button>
            <Badge badgeContent={player.panel.length} color="error">
              <Button color="primary" onClick={() => onPanelBtnClick(player.id, 'panel')}>
                面板
              </Button>
            </Badge>
            <Badge badgeContent={player.target.length} color="error">
              <Button color="primary" onClick={() => onPanelBtnClick(player.id, 'target')}>
                目标
              </Button>
            </Badge>
            <Badge badgeContent={player.bag.length} color="error">
              <Button color="primary" onClick={() => onPanelBtnClick(player.id, 'bag')}>
                背包
              </Button>
            </Badge>
            <Button disabled color="primary">
              <Typography color="inherit">{`创建日期：${player.time}`}</Typography>
            </Button>
            <div style={{ flex: 1 }} />
            <Button color="secondary" onClick={() => handlePlayerDelete(player)}>
              删除
            </Button>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item xs={6} style={{ padding: '0px 8px' }}>
            <DropList
              droppableId={`${player.id}_panel`}
              list={player.panel.map(id => {
                const { name, img } = getDb('goods').find('id', id);
                return { id, name, img };
              })}
              size="large"
              onItemClick={(id, e) => handleItemClick(id, e)}
              onItemContextMenu={(id, index) => {
                // updateTeamPlayer
                handleItemRemove({ ...player, panel: panel.filter((obj, i) => i !== index) });
              }}
            />
          </Grid>
          <Grid item xs={6} style={{ padding: '0px 8px' }}>
            <DropList
              droppableId={`${player.id}_target`}
              list={player.target.map(id => {
                const { name, img } = getDb('goods').find('id', id);
                return { id, name, img };
              })}
              size="large"
              onItemClick={(id, e) => handleItemClick(id, e)}
              onItemContextMenu={(id, index) => {
                handleItemRemove({ ...player, target: target.filter((obj, i) => i !== index) });
              }}
            />
          </Grid>
          <Grid item xs={12} style={{ padding: '0px 8px' }}>
            <DropList
              droppableId={`${player.id}_bag`}
              list={player.bag.map(id => {
                const { name, img } = getDb('goods').find('id', id);
                return { id, name, img };
              })}
              size="small"
              onItemClick={(id, e) => handleItemClick(id, e)}
              onItemContextMenu={(id, index) => {
                handleItemRemove({ ...player, bag: bag.filter((obj, i) => i !== index) });
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </DragDropContext>
  );
};

export default PlayerInfo;
