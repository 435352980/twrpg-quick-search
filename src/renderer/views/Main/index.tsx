import { ipcRenderer } from 'electron';
import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from '@renderer/store';
import { useAppConfigChange, useCommonDataChange } from '@renderer/hooks';
import local from '@renderer/local';
import PageFrame from '@renderer/views/PageFrame';
import helper from './dataSource';

const Main = () => {
  console.log('render-main');
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const setDataHelper = useStoreActions(actions => actions.app.setDataHelper);
  //监听全局数据
  useAppConfigChange();
  useCommonDataChange();

  //初始化数据
  useEffect(() => {
    console.log('set-data');
    setDataHelper(helper);
    ipcRenderer.send('getAppConfig');
    ipcRenderer.send('getFiles');
    ipcRenderer.send('getTeams');
    ipcRenderer.send('getTargets');
  }, [setDataHelper]);
  return (
    <div>
      {!dataHelper && <div>{local.COMMON.LOADING}</div>}
      {dataHelper && <PageFrame />}
    </div>
  );
};

export default Main;
