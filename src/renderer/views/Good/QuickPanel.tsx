import React, { useState } from 'react';
import { Paper, Input, Menu, MenuItem, Checkbox, makeStyles } from '@material-ui/core';

import grey from '@material-ui/core/colors/grey';

import { message } from 'antd';
import ColorBtn from '@/components/ColorBtn';
import { useStoreState, useStoreActions } from '@/store';
import { getStageName } from '@/utils/common';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    background: grey['100'],
    // marginBottom: theme.spacing.unit * 2
    // padding: theme.spacing.unit
  },
  ColorBtn: { margin: theme.spacing(0.5), flex: 1 },
  searchInput: { margin: theme.spacing(0.5), flex: 3 },
}));

interface BtnConfig {
  name: string;
  cat?: string;
  onClick?: () => void;
}

const btns: BtnConfig[] = [
  { name: '全部' },
  { name: '装备', cat: 'arm' },
  { name: '武器', cat: 'weapon' },
  { name: '头盔', cat: 'hat' },
  { name: '衣服', cat: 'armor' },
  { name: '饰品', cat: 'jewelry' },
  { name: '翅膀', cat: 'wing' },
  { name: '材料', cat: 'material' },
  { name: '徽章', cat: 'badge' },
  { name: '结晶', cat: 'powerCrystal' },
  { name: '召唤器', cat: 'summonItem' },
  { name: '任务', cat: 'questItem' },
];

const QuickPanel = () => {
  const classes = useStyles();

  const useMust = useStoreState(state => state.good.useMust);
  const filterStage = useStoreState(state => state.good.filterStage);
  const filterCat = useStoreState(state => state.good.filterCat);

  const setFilterCat = useStoreActions(actions => actions.good.setFilterCat);
  const setFilterText = useStoreActions(actions => actions.good.setFilterText);
  const setFilterStage = useStoreActions(actions => actions.good.setFilterStage);

  const setUseMust = useStoreActions(actions => actions.good.setUseMust);

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);

  const selectStage = (stage: number) => {
    setMenuAnchorEl(null);
    setFilterStage(stage);
  };

  return (
    <Paper className={classes.root}>
      <Checkbox
        style={{ width: 48 }}
        color="primary"
        onChange={() => {
          setUseMust(!useMust);
          message.destroy();
          if (!useMust === true) {
            message.info('已屏蔽次要装备');
          } else {
            message.info('已计入次要装备');
          }
        }}
        checked={useMust}
      />
      {btns.map(config => (
        <ColorBtn
          key={config.name}
          variant="contained"
          // color="primary"
          color={filterCat === config.cat ? 'red' : 'blue'}
          // className={classes.ColorBtn}
          onClick={() => {
            if (config.onClick) {
              config.onClick();
            } else {
              setFilterCat(config.cat || null);
            }
          }}
          onContextMenu={() => setFilterCat('')}
        >
          {config.name}
        </ColorBtn>
      ))}
      <ColorBtn
        variant="contained"
        color={filterStage ? 'red' : 'blue'}
        onClick={e => setMenuAnchorEl(e.currentTarget)}
        onContextMenu={() => setFilterStage(null)}
      >
        {getStageName(filterStage) || '阶段'}
      </ColorBtn>
      <Menu
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem selected={filterStage === 6} onClick={() => selectStage(6)}>
          白怨火
        </MenuItem>
        <MenuItem selected={filterStage === 5} onClick={() => selectStage(5)}>
          主龙
        </MenuItem>
        <MenuItem selected={filterStage === 4} onClick={() => selectStage(4)}>
          四大
        </MenuItem>
        <MenuItem selected={filterStage === 3} onClick={() => selectStage(3)}>
          小四
        </MenuItem>
        <MenuItem selected={filterStage === 2} onClick={() => selectStage(2)}>
          粉末
        </MenuItem>
        <MenuItem selected={filterStage === 1} onClick={() => selectStage(1)}>
          野外
        </MenuItem>
      </Menu>
      <Input
        autoFocus
        placeholder="输入名称进行检索"
        margin="dense"
        className={classes.searchInput}
        onChange={e => setFilterText(e.target.value)}
      />
    </Paper>
  );
};

export default QuickPanel;
