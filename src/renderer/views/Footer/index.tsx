import path from 'path';
import fs from 'fs';
// import React, { useEffect } from 'react';
import React, { useEffect, FC, useState, useRef, useCallback } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { Tooltip, Typography, IconButton } from '@material-ui/core';
import { Modal } from 'antd';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';
import { Refresh as RefreshIcon } from '@material-ui/icons';

import QRCode from 'qrcode.react';
import { ipcRenderer } from 'electron';
import AnalysisView from '../Team/AnalysisView';
import MultiSplit from '../Team/MultiSplit';
import getSaveGoods from '@/utils/getSaveGoods';
import { getAnchor, getSaveCodes } from '@/utils/common';
import { getDb, getImage } from '@/db';
import { useStoreState, useStoreActions } from '@/store';
import useForceUpdate from '@/hooks/useForceUpdate';
import getSaveFileInfo from '@/utils/getSaveFileInfo';
import PrintDialog from '@/components/PrintDialog';
import useSaveFileDrag from '@/hooks/useSaveFileDrag';

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

const Footer: FC<{ showCalc?: boolean }> = ({ showCalc }) => {
  const classes = useStyles();
  const forceUpdate = useForceUpdate();
  const [footerRef, setFooterRef] = useState<HTMLDivElement | null>(null);
  const [dragFile, setDragFile] = useSaveFileDrag(footerRef);
  const war3Path = useStoreState(state => state.app.war3Path);
  const selectedFile = useStoreState(state => state.common.selectedFile);
  const selectedTarget = useStoreState(state => state.common.selectedTarget);
  const addCacheId = useStoreActions(actions => actions.good.addCacheId);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const setCalcView = useStoreActions(actions => actions.view.setCalcView);

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showMultiSplit, setShowMultiSplit] = useState(false);

  const isExists =
    war3Path && selectedFile
      ? fs.existsSync(path.join(war3Path, 'twrpg', `${selectedFile}.txt`))
      : false;

  const forceRefresh = useCallback(() => {
    forceUpdate();
    //存档变更时重置底栏
    setDragFile('');
  }, [forceUpdate, setDragFile]);

  useEffect(() => {
    ipcRenderer.on('updateRecords', forceRefresh);
    ipcRenderer.on('insertRecord', forceRefresh);
    return () => {
      ipcRenderer.removeListener('updateRecords', forceRefresh);
      ipcRenderer.removeListener('insertRecord', forceRefresh);
    };
  }, [forceRefresh]);

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
  const renderItem = () => {
    if (isExists || dragFile) {
      const source =
        dragFile || fs.readFileSync(path.join(war3Path, 'twrpg', `${selectedFile}.txt`)).toString();
      const [panel = [], bag = [], store = [], dust = []] = getSaveGoods(source);
      const allIds = [...panel, ...bag, ...store, ...dust].map((name, index) => {
        const good = getDb('goods').find('name', name.replace(/ x[1-9][0-9]*/, ''));
        return good.id;
      });
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
          <div className={classes.footer}>
            <div className={classes.root}>
              {buildItems('面板', panel)}
              {buildItems('仓库', dust.concat(store))}
              {selectedTarget && showCalc && (
                <>
                  <Button color="primary" onClick={() => setShowMultiSplit(true)}>
                    拆解
                  </Button>
                  <Button color="primary" onClick={() => setShowAnalysis(true)}>
                    分析
                  </Button>
                  <Button
                    color="primary"
                    onClick={e =>
                      setCalcView({
                        ids: selectedTarget.goods,
                        haves: allIds,
                        show: true,
                        anchor: getAnchor(e),
                      })
                    }
                  >
                    计算
                  </Button>

                  <AnalysisView
                    players={[
                      {
                        name: saveFileInfo.playerName,
                        heroId: 'H001',
                        panel,
                        bag: allIds,
                        target: selectedTarget.goods,
                      },
                    ]}
                    show={showAnalysis}
                    handleClose={() => setShowAnalysis(false)}
                  />

                  <PrintDialog
                    name={`全体目标拆解`}
                    show={showMultiSplit}
                    onClose={() => setShowMultiSplit(false)}
                  >
                    <MultiSplit
                      player={{
                        name: saveFileInfo.playerName || '',
                        heroId: 'H001',
                        panel,
                        bag: allIds,
                        target: selectedTarget.goods,
                      }}
                    />
                    )
                  </PrintDialog>
                </>
              )}
            </div>
            {buildItems('背包', bag)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: 32 }}>
            <IconButton
              color="primary"
              style={{ width: 32, height: 32, float: 'left', padding: 0 }}
              onClick={() => setDragFile('')}
            >
              <RefreshIcon />
            </IconButton>
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
  return <div ref={ref => setFooterRef(ref)}>{renderItem()}</div>;
};

export default Footer;
