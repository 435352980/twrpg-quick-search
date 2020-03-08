import { ipcRenderer } from 'electron';
import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from '@renderer/store';
import { useAppConfigChange, useCommonDataChange } from '@renderer/hooks';
import local from '@renderer/local';
import PageFrame from '@renderer/views/PageFrame';
import getDataSource from './getDataSource';

const Main = () => {
  // console.log('render-main');
  const langCursor = useStoreState(state => state.app.langCursor);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const setDataHelper = useStoreActions(actions => actions.app.setDataHelper);
  //监听全局数据
  useAppConfigChange();
  useCommonDataChange();

  //初始化数据
  useEffect(() => {
    // console.log('set-data');
    setDataHelper(getDataSource(['cn', 'en', 'ko'][langCursor] as 'cn' | 'en' | 'ko'));
    ipcRenderer.send('getAppConfig');
    ipcRenderer.send('getFiles');
    ipcRenderer.send('getTeams');
    ipcRenderer.send('getTargets');
  }, [setDataHelper, langCursor]);
  return (
    <div>
      {!dataHelper && <div>{local.common.loading}</div>}
      {dataHelper && <PageFrame />}
    </div>
  );
};

export default Main;
