import { useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';
import { useStoreActions } from '@renderer/store';

/**
 * 监听公共信息变化事件，更新对应store
 */
const useCommonDataChange = () => {
  const { setFiles, setTeams, setTargets } = useStoreActions(actions => actions.common);

  const onUpdateFiles = useCallback((event, files: string[]) => setFiles(files), [setFiles]);
  const onUpdateTeams = useCallback((event, teams: string[]) => setTeams(teams), [setTeams]);
  const onUpdateTargets = useCallback((event, targets: Target[]) => setTargets(targets), [
    setTargets,
  ]);

  useEffect(() => {
    ipcRenderer.addListener('updateFiles', onUpdateFiles);
    ipcRenderer.addListener('updateTeams', onUpdateTeams);
    ipcRenderer.addListener('updateTargets', onUpdateTargets);

    return () => {
      ipcRenderer.removeListener('updateFiles', onUpdateFiles);
      ipcRenderer.removeListener('updateTeams', onUpdateTeams);
      ipcRenderer.removeListener('updateTargets', onUpdateTargets);
    };
  }, [onUpdateFiles, onUpdateTargets, onUpdateTeams]);
};

export default useCommonDataChange;
