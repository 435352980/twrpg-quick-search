import { ipcRenderer } from 'electron';
import React, { useState, useEffect } from 'react';
import { NavigateFn } from '@reach/router';
import {
  AppBar,
  IconButton,
  Typography,
  Button,
  Toolbar,
  Switch,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { message, Modal } from 'antd';

import Select from 'react-select';
import { Props } from 'react-select/src/Select';
import { ValueType } from 'react-select/src/types';

import TeamAddModal from './TeamAddModal';
import { blueHeader } from '@/theme/common';
import { useStoreState, useStoreActions } from '@/store';
import useAppConfigChange from '@/hooks/useAppConfigChange';
import useCommonDataChange from '@/hooks/useCommonDataChange';

// declare const APP_NAME: string;
// declare const APP_VERSION: string;

interface OptionType {
  label: string;
  value: string;
}

const useStyles = makeStyles({
  header: { userSelect: 'none', color: '#fff', background: blueHeader },
  title: { userSelect: 'none', cursor: 'pointer' },
  navRoot: { flexGrow: 1, textAlign: 'center' },
});

const selectProps: Props<OptionType> = {
  styles: {
    container: styles => ({ ...styles, width: 160 }),
    menu: styles => ({ ...styles, color: '#000', zIndex: 2 }),
  },
  getOptionLabel: option => option.label,
  getOptionValue: option => option.value,
  components: { DropdownIndicator: null },
  noOptionsMessage: () => '无数据',
};

const Header: React.FC<{ navigate: NavigateFn }> = ({ navigate }) => {
  const classes = useStyles();

  const { scale, isListen, war3Path, exportPath } = useStoreState(state => state.app);

  const { teams, selectedTeam, files, selectedFile, selectedTarget } = useStoreState(
    state => state.common,
  );
  const { showCache, cacheIds } = useStoreState(state => state.good);
  const { setSelectedTeam, setSelectedFile } = useStoreActions(actions => actions.common);
  const setShowCache = useStoreActions(state => state.good.setShowCache);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);

  useAppConfigChange();
  useCommonDataChange();

  const handleScaleChange = (scaleValue: number) => {
    if (scaleValue !== scale) {
      ipcRenderer.send('changeScale', scaleValue);
    }
    setMenuAnchorEl(null);
  };

  // 缓存板显示隐藏
  useEffect(() => {
    const onToggleCache = () => {
      const tempIds = selectedTarget ? selectedTarget.goods : cacheIds;
      setShowCache(tempIds.length > 0 ? !showCache : false);
    };
    ipcRenderer.addListener('toggleCache', onToggleCache);
    return () => {
      ipcRenderer.removeListener('toggleCache', onToggleCache);
    };
  }, [cacheIds, selectedTarget, setShowCache, showCache]);

  //通知快捷复制
  useEffect(() => {
    const onQuickCopy = (event: unknown, index: number) => {
      selectedFile && ipcRenderer.send('quickCopySection', selectedFile, index);
    };
    ipcRenderer.addListener('quickCopy', onQuickCopy);
    return () => {
      ipcRenderer.removeListener('quickCopy', onQuickCopy);
    };
  }, [selectedFile]);

  //快捷复制完成
  useEffect(() => {
    const onQuickCopySection = (event: unknown, msg: string) => {
      message.success(msg);
    };
    ipcRenderer.addListener('quickCopySection', onQuickCopySection);
    return () => {
      ipcRenderer.removeListener('quickCopySection', onQuickCopySection);
    };
  }, []);

  //初始化数据
  useEffect(() => {
    ipcRenderer.send('getAppConfig');
    ipcRenderer.send('getFiles');
    ipcRenderer.send('getTeams');
    ipcRenderer.send('getTargets');
  }, []);

  return (
    <AppBar position="static" elevation={0} className={classes.header}>
      <Toolbar>
        <Typography
          color="inherit"
          variant="h6"
          className={classes.title}
          onClick={() => setShowInfoModal(true)}
        >
          {`${APP_NAME}(${APP_VERSION})`}
        </Typography>
        <div className={classes.navRoot}>
          {/* <Button disableRipple color="inherit" onClick={() => navigate('/line')}>
            测试
          </Button> */}
          <Button disableRipple color="inherit" onClick={() => navigate('/good')}>
            物品信息
          </Button>

          <Button disableRipple color="inherit" onClick={() => navigate('/hero')}>
            英雄信息
          </Button>
          <Button disableRipple color="inherit" onClick={() => navigate('/unit')}>
            BOSS掉落
          </Button>
          <Button disableRipple color="inherit" onClick={() => navigate('/replay')}>
            聊天记录
          </Button>
          <Button disableRipple color="inherit" onClick={() => navigate('/activity')}>
            活动
          </Button>
        </div>

        <Button
          variant="text"
          color="inherit"
          onClick={() =>
            war3Path ? ipcRenderer.send('openFolder', 'war3Path') : ipcRenderer.send('setWar3Path')
          }
          onContextMenu={() => {
            war3Path &&
              Modal.confirm({
                maskClosable: true,
                mask: false,
                okText: '确定',
                cancelText: '取消',
                okType: 'danger',
                onOk: () => ipcRenderer.send('resetWar3Path'),
                title: '重置确认',
                content: `确认重置war3目录吗`,
              });
          }}
        >
          {`${war3Path ? '打开' : '设定'}魔兽目录`}
        </Button>

        <Button
          variant="text"
          color="inherit"
          onClick={() =>
            exportPath
              ? ipcRenderer.send('openFolder', 'exportPath')
              : ipcRenderer.send('setExportPath')
          }
          onContextMenu={() => {
            exportPath &&
              Modal.confirm({
                maskClosable: true,
                mask: false,
                okText: '确定',
                cancelText: '取消',
                okType: 'danger',
                onOk: () => ipcRenderer.send('resetExportPath'),
                title: '重置确认',
                content: `确认重置录像保存目录吗`,
              });
          }}
        >
          {`${exportPath ? '打开' : '设定'}录像导出目录`}
        </Button>

        <IconButton color="inherit" onClick={() => setShowAddModal(true)}>
          <AddCircleIcon />
        </IconButton>
        <Select
          {...selectProps}
          isClearable
          placeholder="选择分组"
          menuPortalTarget={document.body}
          options={teams.map(name => ({ label: name, value: name }))}
          onChange={(optionValue: ValueType<OptionType>) =>
            setSelectedTeam(optionValue ? (optionValue as OptionType).value : '')
          }
          value={selectedTeam !== '' ? { label: selectedTeam, value: selectedTeam } : null}
        />

        <IconButton
          color="inherit"
          onClick={() =>
            !selectedTeam ? message.warning('请先选择分组后再查看!') : navigate('/team')
          }
        >
          <VisibilityIcon />
        </IconButton>
        <Select
          {...selectProps}
          isClearable
          placeholder="选择存档"
          menuPortalTarget={document.body}
          options={files.map(name => ({ label: name, value: name }))}
          onChange={(optionValue: ValueType<OptionType>) =>
            setSelectedFile(optionValue ? (optionValue as OptionType).value : '')
          }
          value={selectedFile !== '' ? { label: selectedFile, value: selectedFile } : null}
        />
        <IconButton
          color="inherit"
          onClick={() =>
            !selectedFile ? message.warning('请先选择存档后再查看!') : navigate('/record')
          }
        >
          <VisibilityIcon />
        </IconButton>

        <Switch
          checked={isListen}
          value={isListen}
          onChange={() => {
            ipcRenderer.send('changeListen', !isListen);
            message.destroy();
            if (!isListen) {
              message.success('通知 【开启】录像截图保存');
            } else {
              message.warning('通知 【关闭】录像截图保存');
            }
          }}
        />
        <Button variant="text" color="inherit" onClick={e => setMenuAnchorEl(e.currentTarget)}>
          缩放
        </Button>
      </Toolbar>
      <Menu
        anchorEl={menuAnchorEl}
        // keepMounted
        open={Boolean(menuAnchorEl)}
        onChange={e => console.log(e)}
        onClose={() => setMenuAnchorEl(null)}
      >
        {[0.6, 0.8, 1, 1.2, 1.4].map(scaleValue => (
          <MenuItem
            key={scaleValue + ''}
            selected={scale === scaleValue}
            onClick={() => handleScaleChange(scaleValue)}
          >
            {scaleValue === 1 ? '默认' : `${scaleValue}x`}
          </MenuItem>
        ))}
      </Menu>
      <TeamAddModal
        open={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleSubmit={teamName => {
          if (!teams.includes(teamName)) {
            ipcRenderer.send('addTeam', teamName);
          }
        }}
      ></TeamAddModal>
      <Dialog
        scroll="body"
        open={showInfoModal}
        BackdropProps={{ invisible: true }}
        // closeAfterTransition
        onBackdropClick={() => setShowInfoModal(false)}
        onEscapeKeyDown={() => setShowInfoModal(false)}
      >
        <DialogTitle>关于速查</DialogTitle>
        <DialogContent>
          <Typography variant="body1">速查更新地址:</Typography>
          <Typography variant="body1" color="primary">
            https://pan.baidu.com/s/1GD2-xbihfJoySbQX5Zxe7w
          </Typography>
          <Typography variant="body1">速查H5:</Typography>
          <Typography variant="body1" color="primary">
            https://435352980.github.io/tw-qc-static
          </Typography>
          <Typography variant="body1">交流反馈群:</Typography>
          <Typography variant="body1" color="primary">
            558390498
          </Typography>
          <Typography variant="body1" color="secondary">
            打广告属于弟弟行为，无奈度娘疯狂吞链......
          </Typography>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Header;
