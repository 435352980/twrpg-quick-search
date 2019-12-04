import fs from 'fs';
import { useEffect, useState } from 'react';

/**
 * 监听存档拖拽事件
 * @param target DOMElement
 */
const useFileDrag = (
  target: HTMLDivElement | null,
): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [dragFile, setDragFile] = useState<string>('');
  useEffect(() => {
    const preventEvt = (e: any) => e.preventDefault();
    const dropEvt = async (e: any) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      const ext = file.name.substr(file.name.lastIndexOf('.')).toLowerCase();
      if (ext === '.txt') {
        setDragFile(fs.readFileSync(file.path).toString());
      }
    };

    target && target.addEventListener('drop', dropEvt);
    target && target.addEventListener('dragover', preventEvt);
    target && target.addEventListener('dragend', preventEvt);
    return () => {
      target && target.removeEventListener('drop', dropEvt);
      target && target.removeEventListener('dragover', preventEvt);
      target && target.removeEventListener('dragend', preventEvt);
    };
  }, [target]);
  return [dragFile, setDragFile];
};

export default useFileDrag;
