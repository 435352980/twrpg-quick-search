import path from 'path';
import fs from 'fs';
// import React, { useEffect } from 'react';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { Tooltip, Typography, IconButton } from '@material-ui/core';
import { Modal } from 'antd';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';

import QRCode from 'qrcode.react';
import { ipcRenderer } from 'electron';
import getSaveGoods from '@/utils/getSaveGoods';
import { getAnchor, getSaveCodes } from '@/utils/common';
import { getDb, getImage } from '@/db';
import { useStoreState, useStoreActions } from '@/store';
import useForceUpdate from '@/hooks/useForceUpdate';
import getSaveFileInfo from '@/utils/getSaveFileInfo';

const useStyles = makeStyles(theme => ({
  root: {
    height: 32,
    display: 'flex',
    // justifyContent: 'center',
    flex: 1,
  },
  emptyRoot: {
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    height: 64,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  tip: {
    fontWeight: 400,
    backgroundImage: 'linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)',
    color: '#000',
    fontSize: '1.2rem',
  },
  tooltipPopper: { opacity: 1 },
  img: { width: 32, height: 32 },
  imgCursor: {
    width: 32,
    height: 32,
    cursor: 'pointer',
    userSelect: 'none',
  },
  footerText: {
    display: 'flex',
    height: 32,
    alignItems: 'center',
    float: 'left',
    marginLeft: 8,
  },
}));

const Footer = () => {
  const classes = useStyles();
  const forceUpdate = useForceUpdate();
  const war3Path = useStoreState(state => state.app.war3Path);
  const selectedFile = useStoreState(state => state.common.selectedFile);
  const addCacheId = useStoreActions(actions => actions.good.addCacheId);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const isExists =
    war3Path && selectedFile
      ? fs.existsSync(path.join(war3Path, 'twrpg', `${selectedFile}.txt`))
      : false;

  useEffect(() => {
    ipcRenderer.on('updateRecords', forceUpdate);
    ipcRenderer.on('insertRecord', forceUpdate);
    return () => {
      ipcRenderer.removeListener('updateRecords', forceUpdate);
      ipcRenderer.removeListener('insertRecord', forceUpdate);
    };
  }, [forceUpdate]);
  // useEffect(() => {
  //     if (isExists) {
  //         const sourceText = fs.readFileSync(path.join(war3Path, 'twrpg', `${saveFile.name}.txt`)).toString();
  //         const [panel = [], bag = [], dust = []] = getSaveGoods(sourceText);
  //         console.log(makeList
  //             .reduce((acc, { id, subIds }) => {
  //                 const source = [...panel, ...bag, ...dust].reduce((acc, name) => {
  //                     const good = getDb('goods').find('name', name);
  //                     if (good) {
  //                         acc.push(good.id);
  //                     }
  //                     return acc;
  //                 }, []);
  //                 if (arrayDiff(source, subIds).added.length === 2 && !acc.includes(id)) {
  //                     acc.push(id);
  //                 }
  //                 return acc;
  //             }, [])
  //             .map(id => getDb('goods').find('id', id).name));
  //     }
  // }, [isExists]);
  const buildItems = (tagName: string, list: string[]) => {
    if (list && list.length === 0) {
      return null;
    }
    return (
      <span>
        <Typography className={classes.footerText} variant="body1">{`${tagName}：`}</Typography>
        {list.map((name, i) => {
          const good = getDb('goods').find('name', name.replace(/ x[1-9][0-9]*/, ''));
          return (
            <Tooltip
              key={i}
              classes={{
                tooltip: classes.tip,
              }}
              placement="top"
              title={name}
            >
              {good ? (
                <img
                  className={classes.imgCursor}
                  alt={name}
                  src={getImage(good.img)}
                  onClick={e =>
                    setDetailView({
                      id: good.id,
                      show: true,
                      anchor: getAnchor(e),
                      isGood: true,
                    })
                  }
                  onContextMenu={() => addCacheId(good.id)}
                />
              ) : (
                <img className={classes.img} alt={name} src={getImage('BTNSpy')} />
              )}
            </Tooltip>
          );
        })}
      </span>
    );
  };
  if (isExists) {
    const source = fs.readFileSync(path.join(war3Path, 'twrpg', `${selectedFile}.txt`)).toString();
    const [panel = [], bag = [], store = [], dust = []] = getSaveGoods(source);
    const saveCodes = getSaveCodes(source) || [];
    const saveFileInfo = getSaveFileInfo(source, selectedFile);

    if ([...panel, ...bag, ...store, ...dust].length === 0) {
      return (
        <div className={classes.emptyRoot}>
          <Typography variant="body1" align="center">
            感谢所有地图支持者^_^
          </Typography>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <IconButton
          color="primary"
          style={{
            width: 32,
            height: 32,
            float: 'left',
            padding: 0,
          }}
          onClick={() =>
            Modal.info({
              maskClosable: true,
              mask: false,
              okButtonProps: { hidden: true },
              title: '装备二维码',
              content: (
                <QRCode
                  size={280}
                  value={JSON.stringify({
                    ...saveFileInfo,
                    codes: saveCodes,
                    panel,
                    store,
                    bag,
                    dust,
                  })}
                />
              ),
            })
          }
        >
          <AddCircleIcon />
        </IconButton>
        <div className={classes.footer}>
          <div className={classes.root}>
            {buildItems('面板', panel)}
            {buildItems('仓库', dust.concat(store))}
          </div>
          {buildItems('背包', bag)}
        </div>
      </div>
    );
  }
  return (
    <div className={classes.emptyRoot}>
      <Typography variant="body1" align="center">
        感谢所有地图支持者^_^
      </Typography>
    </div>
  );
};

export default Footer;
