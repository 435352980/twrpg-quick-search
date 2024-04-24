import { ipcRenderer, webFrame } from 'electron';
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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { message, confirm } from '@renderer/helper';

import Select, { DropDownComponent } from '@renderer/thirdParty/Select';

import { useStoreState, useStoreActions } from '@renderer/store';
import CyanTooltip from '@renderer/components/CyanTooltip';
import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';
import TeamAddModal from './TeamAddModal';

// declare const APP_NAME: string;
declare const APP_VERSION: string;
declare const SUIT_VERSION: string;

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
  const local = useStoreState(state => state.app.local);
  const { scale, isListen, repExt, war3Path, exportPath, langCursor } = useStoreState(
    state => state.app,
  );

  const { teams, selectedTeam, files, selectedFile, selectedTarget } = useStoreState(
    state => state.common,
  );

  const { showCache, cacheIds } = useStoreState(state => state.good);
  const setLangCursor = useStoreActions(actions => actions.app.setLangCursor);
  const { setSelectedTeam, setSelectedFile } = useStoreActions(actions => actions.common);
  const setShowCache = useStoreActions(state => state.good.setShowCache);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [langMenuAnchorEl, setLangMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [repExtMenuAnchorEl, setRepExtMenuAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleScaleChange = (scaleValue: number) => {
    if (scaleValue !== scale) {
      ipcRenderer.send('changeScale', scaleValue);
    }
    setMenuAnchorEl(null);
  };

  const handleRepExtChange = (ext: string) => {
    if (ext !== repExt) {
      ipcRenderer.send('changeRepExt', ext);
    }
    setRepExtMenuAnchorEl(null);
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

  // 通知快捷复制
  useEffect(() => {
    const onQuickCopy = (event: unknown, index: number) => {
      selectedFile && ipcRenderer.send('quickCopySection', selectedFile, index);
    };
    ipcRenderer.addListener('quickCopy', onQuickCopy);
    return () => {
      ipcRenderer.removeListener('quickCopy', onQuickCopy);
    };
  }, [selectedFile]);

  // 快捷复制完成
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
        <CyanTooltip title={SUIT_VERSION}>
          <Typography
            color="inherit"
            variant="h6"
            style={{ userSelect: 'none', cursor: 'pointer' }}
            onClick={() => setShowInfoModal(true)}
          >
            {`${local.views.header.appName}`}
          </Typography>
        </CyanTooltip>
        <div style={{ flexGrow: 1, textAlign: 'center' }}>
          <Button
            disableRipple
            color="inherit"
            onClick={() => {
              history.push('/good');
              webFrame.setZoomFactor(scale);
            }}
          >
            {local.views.header.items}
          </Button>

          <Button
            disableRipple
            color="inherit"
            onClick={() => {
              history.push('/hero');
              webFrame.setZoomFactor(scale);
            }}
          >
            {local.views.header.heroes}
          </Button>
          <Button
            disableRipple
            color="inherit"
            onClick={() => {
              history.push('/unit');
              webFrame.setZoomFactor(scale);
            }}
          >
            {local.views.header.bosses}
          </Button>
          <Button
            disableRipple
            color="inherit"
            onClick={() => {
              history.push('/replay');
              webFrame.setZoomFactor(scale);
            }}
          >
            {local.views.header.repChats}
          </Button>
          <Button
            disableRipple
            color="inherit"
            onClick={() => {
              history.push('/activity');
              webFrame.setZoomFactor(scale);
            }}
          >
            {local.views.header.activities}
          </Button>
        </div>
        <CyanTooltip title={local.views.header.resetPath}>
          <Button
            variant="text"
            color="inherit"
            onClick={() =>
              war3Path
                ? ipcRenderer.send('openFolder', 'war3Path')
                : ipcRenderer.send('setWar3Path')
            }
            onContextMenu={() => {
              confirm(
                {
                  // okText: 'dddd',
                  onOk: () => ipcRenderer.send('resetWar3Path'),
                  title: local.views.header.resetDialog.title,
                  content: local.views.header.resetDialog.message.war3,
                },
                local,
              );
            }}
          >
            {`${war3Path ? local.views.header.openWar3Path : local.views.header.setWar3Path}`}
          </Button>
        </CyanTooltip>
        <CyanTooltip title={local.views.header.resetPath}>
          <Button
            variant="text"
            color="inherit"
            onClick={() =>
              exportPath
                ? ipcRenderer.send('openFolder', 'exportPath')
                : ipcRenderer.send('setExportPath')
            }
            onContextMenu={() => {
              confirm(
                {
                  onOk: () => ipcRenderer.send('resetExportPath'),
                  title: local.views.header.resetDialog.title,
                  content: local.views.header.resetDialog.message.export,
                },
                local,
              );
            }}
          >
            {`${exportPath ? local.views.header.openExportPath : local.views.header.setExportPath}`}
          </Button>
        </CyanTooltip>

        <CyanTooltip title={local.views.header.team.add}>
          <IconButton color="inherit" onClick={() => setShowAddModal(true)}>
            <AddCircleIcon />
          </IconButton>
        </CyanTooltip>
        <HeaderSelect
          clearable
          searchable
          noDataLabel={local.common.notFound}
          placeholder={local.views.header.team.select}
          portal={document.body}
          options={teams.map(name => ({ label: name, value: name }))}
          onChange={([option]) => setSelectedTeam(option?.value || '')}
          values={selectedTeam !== '' ? [{ label: selectedTeam, value: selectedTeam }] : []}
        />

        <CyanTooltip title={local.views.header.team.view}>
          <IconButton
            color="inherit"
            onClick={() => {
              if (!selectedTeam) {
                message.warning(local.views.header.team.notice);
              } else {
                history.push('/team');
                webFrame.setZoomFactor(scale);
              }
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </CyanTooltip>

        <HeaderSelect
          clearable
          searchable
          noDataLabel={local.common.notFound}
          placeholder={local.views.header.save.select}
          portal={document.body}
          options={files.map(name => ({ label: name, value: name }))}
          onChange={([option]) => setSelectedFile(option?.value || '')}
          values={selectedFile !== '' ? [{ label: selectedFile, value: selectedFile }] : []}
        />
        <CyanTooltip title={local.views.header.save.view}>
          <IconButton
            color="inherit"
            onClick={() => {
              if (!selectedFile) {
                message.warning(local.views.header.save.notice);
              } else {
                history.push('/record');
                webFrame.setZoomFactor(scale);
              }
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </CyanTooltip>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button
            variant="text"
            color="inherit"
            style={{ padding: 0 }}
            onClick={e => setRepExtMenuAnchorEl(e.currentTarget)}
          >
            {repExt === 'w3g' ? 'w3g' : 'nwg'}
          </Button>

          <Switch
            checked={isListen}
            value={isListen}
            onChange={() => {
              ipcRenderer.send('changeListen', !isListen);
              message.destroy();
              if (!isListen) {
                message.success(local.views.header.listenOn);
              } else {
                message.warning(local.views.header.listenOff);
              }
            }}
          />
        </div>

        <Button variant="text" color="inherit" onClick={e => setMenuAnchorEl(e.currentTarget)}>
          {local.views.header.scale}
        </Button>

        <CyanTooltip title={local.common.selectLanguage}>
          <Button
            variant="text"
            color="inherit"
            onClick={e => setLangMenuAnchorEl(e.currentTarget)}
          >
            {['cn', 'en', 'ko'][langCursor]}
          </Button>
        </CyanTooltip>
      </Toolbar>
      <Menu
        anchorEl={menuAnchorEl}
        // keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        {[0.6, 0.8, 1, 1.2, 1.4].map(scaleValue => (
          <MenuItem
            key={scaleValue + 'scale' + ''}
            selected={scale === scaleValue}
            onClick={() => handleScaleChange(scaleValue)}
          >
            {`${scaleValue}x`}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        anchorEl={langMenuAnchorEl}
        // keepMounted
        open={Boolean(langMenuAnchorEl)}
        onClose={() => setLangMenuAnchorEl(null)}
      >
        {['CN', 'EN', 'KO'].map((lang, cursor) => (
          <MenuItem
            key={cursor + 'langCursor' + ''}
            selected={langCursor === cursor}
            onClick={() => {
              setLangCursor(cursor);
              setLangMenuAnchorEl(null);
            }}
          >
            {lang}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={repExtMenuAnchorEl}
        // keepMounted
        open={Boolean(repExtMenuAnchorEl)}
        onClose={() => setRepExtMenuAnchorEl(null)}
      >
        {['w3g', 'nwg'].map((ext, index) => (
          <MenuItem key={ext} selected={ext === repExt} onClick={() => handleRepExtChange(ext)}>
            {ext}
          </MenuItem>
        ))}
      </Menu>

      <TeamAddModal
        local={local}
        open={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleSubmit={teamName => {
          if (!teams.includes(teamName)) {
            ipcRenderer.send('addTeam', teamName);
          }
        }}
      ></TeamAddModal>
      <Dialog
        maxWidth={632}
        scroll="body"
        open={showInfoModal}
        BackdropProps={{ invisible: true }}
        // closeAfterTransition
        onBackdropClick={() => setShowInfoModal(false)}
        onEscapeKeyDown={() => setShowInfoModal(false)}
      >
        <DialogTitle>{local.views.header.about}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            中国世界RPG官网:
            <Typography variant="subtitle1" color="secondary" component="span">
              &nbsp;&nbsp; twrpg.fun
            </Typography>
          </Typography>

          <Typography variant="body1">
            当前版本:
            <Typography variant="subtitle1" color="secondary" component="span">
              &nbsp;&nbsp; {APP_VERSION + '_' + SUIT_VERSION}
            </Typography>
          </Typography>
          <br />
          <Typography variant="body1">{local.views.header.releaseUrl}:</Typography>
          <Typography variant="subtitle1" color="secondary">
            感谢魅影无名
          </Typography>
          <Typography variant="body1" color="primary">
            https://twrpg.fun/RecordFile/download/QuickSearch.7z
          </Typography>
          <Typography variant="subtitle1" color="secondary">
            Thanks Vitory Hero , Rock Lee(Special thanks!!!!!!)
          </Typography>
          <Typography variant="body1" color="primary">
            https://discord.com/channels/417191619679223808/1022638414127960074
          </Typography>

          <Typography variant="body1">{local.views.header.h5}:</Typography>
          <Typography variant="body1" color="primary">
            https://twrpg.fun/RecordFile/h5
            <Typography variant="subtitle1" color="secondary" component="span">
              &nbsp;&nbsp;感谢魅影无名
            </Typography>
          </Typography>
          <Typography variant="body1">{local.views.header.qq}:</Typography>
          <Typography variant="body1" color="primary">
            558390498
          </Typography>
          <Typography variant="body1" color="secondary">
            {local.views.header.ps}
          </Typography>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </HeaderBar>
  );
};

export default Header;
