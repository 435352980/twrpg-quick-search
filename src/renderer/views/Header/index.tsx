import { ipcRenderer } from 'electron';
import React, { useState, useEffect } from 'react';
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
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import { message, confirm } from '@renderer/helper';

import Select, { DropDownComponent } from '@renderer/thirdParty/Select';

import { useStoreState, useStoreActions } from '@renderer/store';
import CyanTooltip from '@renderer/components/CyanTooltip';
import local from '@renderer/local';
import { useHistory } from 'react-router-dom';
import TeamAddModal from './TeamAddModal';
import styled from '@emotion/styled';

declare const APP_NAME: string;
declare const APP_VERSION: string;

const HeaderSelect = styled(Select)`
  background: #fff;
  color: black;
  width: 160px;
  border-radius: 4px;
` as DropDownComponent<{ label: string; value: string }>;

const HeaderBar = styled(AppBar)`
  background: repeating-linear-gradient(
    135deg,
    #2b3284,
    #2b3284 10%,
    #4177bc 10%,
    #4177bc 17%,
    #2b3284 17%,
    #2b3284 27%,
    #4177bc 27%,
    #ffffff 20%,
    #4177bc 21%,
    #4177bc 45%,
    #ffffff 45%,
    #ffffff 45%
  );
`;

const Header: React.FC = () => {
  const history = useHistory();
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

  const handleScaleChange = (scaleValue: number) => {
    if (scaleValue !== scale) {
      ipcRenderer.send('changeScale', scaleValue);
    }
    setMenuAnchorEl(null);
  };

  // 缓存板显示隐藏
  useEffect(() => {
    const onToggleCache = () => {
      const tempIds = selectedTarget ? selectedTarget.targets : cacheIds;
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

  return (
    <HeaderBar position="static">
      <Toolbar>
        <Typography
          color="inherit"
          variant="h6"
          style={{ userSelect: 'none', cursor: 'pointer' }}
          onClick={() => setShowInfoModal(true)}
        >
          {`${local.APP_HEADER.TITLE}(${APP_VERSION})`}
        </Typography>
        <div style={{ flexGrow: 1, textAlign: 'center' }}>
          <Button disableRipple color="inherit" onClick={() => history.push('/good')}>
            {local.APP_HEADER.ITEMS}
          </Button>

          <Button disableRipple color="inherit" onClick={() => history.push('/hero')}>
            {local.APP_HEADER.HEROES}
          </Button>
          <Button disableRipple color="inherit" onClick={() => history.push('/unit')}>
            {local.APP_HEADER.BOSS}
          </Button>
          <Button disableRipple color="inherit" onClick={() => history.push('/replay')}>
            {local.APP_HEADER.REP_CHAT}
          </Button>
          <Button disableRipple color="inherit" onClick={() => history.push('/activity')}>
            {local.APP_HEADER.ACTIVITY}
          </Button>
        </div>
        <CyanTooltip title={local.APP_HEADER.RESET_PATH}>
          <Button
            variant="text"
            color="inherit"
            onClick={() =>
              war3Path
                ? ipcRenderer.send('openFolder', 'war3Path')
                : ipcRenderer.send('setWar3Path')
            }
            onContextMenu={() => {
              confirm({
                onOk: () => ipcRenderer.send('resetWar3Path'),
                title: local.APP_HEADER.RESET_CONFIRM,
                content: local.APP_HEADER.RESET_CONFIRM_CONTENT_WAR3_PATH,
              });
            }}
          >
            {`${war3Path ? local.APP_HEADER.OPEN_WAR3_PATH : local.APP_HEADER.SET_WAR3_PATH}`}
          </Button>
        </CyanTooltip>
        <CyanTooltip title={local.APP_HEADER.RESET_PATH}>
          <Button
            variant="text"
            color="inherit"
            onClick={() =>
              exportPath
                ? ipcRenderer.send('openFolder', 'exportPath')
                : ipcRenderer.send('setExportPath')
            }
            onContextMenu={() => {
              confirm({
                onOk: () => ipcRenderer.send('resetExportPath'),
                title: local.APP_HEADER.RESET_CONFIRM,
                content: local.APP_HEADER.RESET_CONFIRM_CONTENT_EXPORT_PATH,
              });
            }}
          >
            {`${exportPath ? local.APP_HEADER.OPEN_EXPORT_PATH : local.APP_HEADER.SET_EXPORT_PATH}`}
          </Button>
        </CyanTooltip>

        <CyanTooltip title={local.APP_HEADER.ADD_TEAM}>
          <IconButton color="inherit" onClick={() => setShowAddModal(true)}>
            <AddCircleIcon />
          </IconButton>
        </CyanTooltip>
        <HeaderSelect
          clearable
          searchable
          noDataLabel={local.COMMON.NOT_FOUND}
          placeholder={local.APP_HEADER.SELCT_TEAM}
          portal={document.body}
          options={teams.map(name => ({ label: name, value: name }))}
          onChange={([option]) => setSelectedTeam(option?.value || '')}
          values={selectedTeam !== '' ? [{ label: selectedTeam, value: selectedTeam }] : []}
        />

        <CyanTooltip title={local.APP_HEADER.VIEW_TEAM}>
          <IconButton
            color="inherit"
            onClick={() =>
              !selectedTeam
                ? message.warning(local.APP_HEADER.SELECT_TEAM_NOTICE)
                : history.push('/team')
            }
          >
            <VisibilityIcon />
          </IconButton>
        </CyanTooltip>

        <HeaderSelect
          clearable
          searchable
          noDataLabel={local.COMMON.NOT_FOUND}
          placeholder={local.APP_HEADER.SELECT_SAVE_FILE}
          portal={document.body}
          options={files.map(name => ({ label: name, value: name }))}
          onChange={([option]) => setSelectedFile(option?.value || '')}
          values={selectedFile !== '' ? [{ label: selectedFile, value: selectedFile }] : []}
        />
        <CyanTooltip title={local.APP_HEADER.VIEW_SAVE_HISTORIES}>
          <IconButton
            color="inherit"
            onClick={() =>
              !selectedFile
                ? message.warning(local.APP_HEADER.SELECT_SAVE_FILE_NOTICE)
                : history.push('/record')
            }
          >
            <VisibilityIcon />
          </IconButton>
        </CyanTooltip>

        <Switch
          checked={isListen}
          value={isListen}
          onChange={() => {
            ipcRenderer.send('changeListen', !isListen);
            message.destroy();
            if (!isListen) {
              message.success(local.APP_HEADER.LISTEN_ON);
            } else {
              message.warning(local.APP_HEADER.LISTEN_OFF);
            }
          }}
        />

        <Button variant="text" color="inherit" onClick={e => setMenuAnchorEl(e.currentTarget)}>
          {local.APP_HEADER.SCALE}
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
            {`${scaleValue}x`}
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
        <DialogTitle>{local.APP_HEADER.ABOUT}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{local.APP_HEADER.RELEACE_LINK}:</Typography>
          <Typography variant="body1" color="primary">
            https://pan.baidu.com/s/1GD2-xbihfJoySbQX5Zxe7w
          </Typography>
          <Typography variant="body1">{local.APP_HEADER.H5_LINK}:</Typography>
          <Typography variant="body1" color="primary">
            https://435352980.github.io/tw-qc-static
          </Typography>
          <Typography variant="body1">{local.APP_HEADER.QQ}:</Typography>
          <Typography variant="body1" color="primary">
            558390498
          </Typography>
          <Typography variant="body1" color="secondary">
            {local.APP_HEADER.PS}
          </Typography>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </HeaderBar>
  );
};

export default Header;
