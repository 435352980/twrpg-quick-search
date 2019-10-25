import { useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';
import { useStoreActions } from '@/store';

/**
 * 监听公共信息变化事件，更新对应store
 */
const useCommonDataChange = () => {
  const { setFiles, setTeams } = useStoreActions(actions => actions.common);

  const onUpdateFiles = useCallback((event, files: string[]) => setFiles(files), [setFiles]);
  const onUpdateTeams = useCallback((event, teams: string[]) => setTeams(teams), [setTeams]);

  useEffect(() => {
    ipcRenderer.addListener('updateFiles', onUpdateFiles);
    ipcRenderer.addListener('updateTeams', onUpdateTeams);

    return () => {
      ipcRenderer.removeListener('updateFiles', onUpdateFiles);
      ipcRenderer.removeListener('updateTeams', onUpdateTeams);
    };
  }, [onUpdateFiles, onUpdateTeams]);
};

export default useCommonDataChange;
