import React, { useState, useCallback } from 'react';
import { Paper, Input, Menu, MenuItem, useTheme } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

import { useStoreState, useStoreActions } from '@renderer/store';
import ColorBtn from '@renderer/components/ColorBtn';
import local from '@renderer/local';
import styled from '@emotion/styled';

const btns = [
  { name: local.COMMON.ALL, cat: undefined },
  ...Object.entries(local.COMMON.CATEGORIES).map(([cat, name]) => ({ name, cat })),
];

const PanelRoot = styled(Paper)`
  display: flex;
  justify-content: center;
  width: 100%;
  background: ${grey['100']};
`;

const QuickPanel = () => {
  const theme = useTheme();

  const filterStage = useStoreState(state => state.good.filterStage);
  const filterCat = useStoreState(state => state.good.filterCat);

  const setFilterCat = useStoreActions(actions => actions.good.setFilterCat);
  const setFilterText = useStoreActions(actions => actions.good.setFilterText);
  const setFilterStage = useStoreActions(actions => actions.good.setFilterStage);

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);

  const selectStage = useCallback(
    (stage: number) => {
      setMenuAnchorEl(null);
      setFilterStage(stage);
    },
    [setFilterStage],
  );

  return (
    <PanelRoot>
      {btns.map(config => (
        <ColorBtn
          key={config.name}
          variant="contained"
          // color="primary"
          color={filterCat === config.cat ? 'secondary' : 'primary'}
          // className={classes.ColorBtn}
          onClick={() => {
            setFilterCat((config.cat as any) || null);
          }}
          onContextMenu={() => setFilterCat(null)}
        >
          {config.name}
        </ColorBtn>
      ))}
      <ColorBtn
        variant="contained"
        color={filterStage ? 'secondary' : 'primary'}
        onClick={e => setMenuAnchorEl(e.currentTarget)}
        onContextMenu={() => setFilterStage(null)}
      >
        {local.COMMON.STAGES[filterStage] || local.COMMON.STAGE}
      </ColorBtn>
      <Menu
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem selected={filterStage === 6} onClick={() => selectStage(6)}>
          {local.COMMON.STAGES[6]}
        </MenuItem>
        <MenuItem selected={filterStage === 5} onClick={() => selectStage(5)}>
          {local.COMMON.STAGES[5]}
        </MenuItem>
        <MenuItem selected={filterStage === 4} onClick={() => selectStage(4)}>
          {local.COMMON.STAGES[4]}
        </MenuItem>
        <MenuItem selected={filterStage === 3} onClick={() => selectStage(3)}>
          {local.COMMON.STAGES[3]}
        </MenuItem>
        <MenuItem selected={filterStage === 2} onClick={() => selectStage(2)}>
          {local.COMMON.STAGES[2]}
        </MenuItem>
        <MenuItem selected={filterStage === 1} onClick={() => selectStage(1)}>
          {local.COMMON.STAGES[1]}
        </MenuItem>
      </Menu>
      <Input
        autoFocus
        placeholder="输入名称进行检索"
        margin="dense"
        style={{ margin: theme.spacing(0.5), flex: 3 }}
        onChange={e => setFilterText(e.target.value)}
      />
    </PanelRoot>
  );
};

export default QuickPanel;
