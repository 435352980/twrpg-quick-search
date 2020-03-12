import React, { useState, useCallback } from 'react';
import { Paper, Input, Menu, MenuItem, useTheme } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

import { useStoreState, useStoreActions } from '@renderer/store';
import ColorBtn from '@renderer/components/ColorBtn';
import styled from '@emotion/styled';

const PanelRoot = styled(Paper)`
  display: flex;
  justify-content: center;
  width: 100%;
  background: ${grey['100']};
`;

const QuickPanel = () => {
  const theme = useTheme();

  const local = useStoreState(state => state.app.local);
  const filterStage = useStoreState(state => state.good.filterStage);
  const filterCat = useStoreState(state => state.good.filterCat);

  const setFilterCat = useStoreActions(actions => actions.good.setFilterCat);
  const setFilterText = useStoreActions(actions => actions.good.setFilterText);
  const setFilterStage = useStoreActions(actions => actions.good.setFilterStage);

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);

  const btns = [
    { name: local.common.all, cat: undefined },
    ...Object.entries(local.common.categories).map(([cat, name]) => ({ name, cat })),
  ];

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
        {local.common.stages[filterStage] || local.common.stage}
      </ColorBtn>
      <Menu
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        {[...local.common.stages]
          .reverse()
          .filter(stage => stage)
          .map((stage, index) => (
            <MenuItem
              key={index}
              selected={filterStage === 6 - index}
              onClick={() => selectStage(6 - index)}
            >
              {stage}
            </MenuItem>
          ))}
      </Menu>
      <Input
        autoFocus
        placeholder={local.views.good.searchPlaceholder}
        margin="dense"
        style={{ margin: theme.spacing(0.5), flex: 3 }}
        onChange={e => setFilterText(e.target.value)}
      />
    </PanelRoot>
  );
};

export default QuickPanel;
