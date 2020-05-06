import { webFrame } from 'electron';
import { useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';
import { useStoreActions } from '@renderer/store';

interface AppConfig {
  war3Path?: string;
  exportPath?: string;
  isListen?: boolean;
  repExt?: string;
  scale?: number;
}

/**
 * 监听配置文件变化事件，更新对应store
 */
const useAppConfigChange = () => {
  const { setWar3Path, setExportPath, setIsListen, setRepExt, setScale } = useStoreActions(
    actions => actions.app,
  );

  const onUpdateAppConfig = useCallback(
    (event, appConfig: AppConfig) => {
      // console.log(appConfig);
      const { war3Path, exportPath, isListen, repExt, scale } = appConfig;
      war3Path !== undefined && setWar3Path(war3Path);
      exportPath !== undefined && setExportPath(exportPath);
      isListen !== undefined && setIsListen(isListen);
      repExt !== undefined && setRepExt(repExt);
      if (scale !== undefined) {
        setScale(scale);
        webFrame.setZoomFactor(scale);
      }
    },
    [setExportPath, setIsListen, setRepExt, setScale, setWar3Path],
  );

  useEffect(() => {
    ipcRenderer.addListener('updateAppConfig', onUpdateAppConfig);

    return () => {
      ipcRenderer.removeListener('updateAppConfig', onUpdateAppConfig);
    };
  }, [onUpdateAppConfig]);
};

export default useAppConfigChange;
