import { ipcRenderer } from 'electron';
import React, { useEffect, useCallback } from 'react';
import { useStoreActions, useStoreState } from '@renderer/store';
import { useAppConfigChange, useCommonDataChange } from '@renderer/hooks';
import getLocal from '@renderer/seed/getLocal';
import PageFrame from '@renderer/views/PageFrame';
import { Typography } from '@material-ui/core';
import getDataSource from './getDataSource';

const Main = () => {
  // console.log('render-main');
  const langCursor = useStoreState(state => state.app.langCursor);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const local = useStoreState(state => state.app.local);
  const setLocal = useStoreActions(actions => actions.app.setLocal);
  const setDataHelper = useStoreActions(actions => actions.app.setDataHelper);
  //监听全局数据
  useAppConfigChange();
  useCommonDataChange();

  const loadData = useCallback(async () => {
    const local = getLocal(['cn', 'en', 'ko'][langCursor] as 'cn' | 'en' | 'ko') as Local;
    const data = await getDataSource(['cn', 'en', 'ko'][langCursor] as 'cn' | 'en' | 'ko');
    setLocal(local);
    setDataHelper(data);
  }, [langCursor, setDataHelper, setLocal]);

  //初始化数据
  useEffect(() => {
    // console.log('set-data');
    loadData();
    ipcRenderer.send('getAppConfig');
    ipcRenderer.send('getFiles');
    ipcRenderer.send('getTeams');
    ipcRenderer.send('getTargets');
  }, [loadData]);
  return (
    <div>
      {(!dataHelper || !local) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: '100vh',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" color="primary">
            Loading Data...
          </Typography>
        </div>
      )}
      {dataHelper && local && <PageFrame />}
    </div>
  );
};

export default Main;
