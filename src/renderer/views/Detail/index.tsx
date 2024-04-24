import { clipboard, nativeImage } from 'electron';
import React, { useCallback, useEffect } from 'react';
import { Drawer } from '@mui/material';
import htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { message } from '@renderer/helper';
import { useStoreActions, useStoreState } from '@renderer/store';
import IconImage from '@renderer/components/IconImage';
import CyanTooltip from '@renderer/components/CyanTooltip';
import Intro from './Intro';

interface DetailViewProps {
  /**
   * 物品或单位ID
   */
  id?: string;
  /**
   * 挂载位置
   */
  anchor: 'left' | 'right';
  /**
   * 显示/隐藏
   */
  show: boolean;
}

const Detail: React.FC<DetailViewProps> = ({ id, anchor, show }) => {
  const drawerRef = React.useRef<HTMLDivElement>();
  const printRef = React.useRef<HTMLDivElement>();

  const dataHelper = useStoreState(state => state.app.dataHelper);
  const detailCacheIds = useStoreState(state => state.view.detailCacheIds);

  const setDetailView = useStoreActions(actions => actions.view.setDetailView);

  const doCopy = useCallback(() => {
    printRef.current &&
      htmlToImage
        .toPng(printRef.current, {
          quality: 1,
          backgroundColor: 'white',
          width: printRef.current.scrollWidth,
          height: printRef.current.scrollHeight,
          style: { marginTop: 0 },
        })
        .then(url => {
          clipboard.writeImage(nativeImage.createFromDataURL(url));
          message.success('图片已复制至剪切板');
        });
  }, []);

  const doExport = useCallback(
    (name: string) =>
      printRef.current &&
      htmlToImage
        .toPng(printRef.current, {
          quality: 1,
          backgroundColor: 'white',
          width: printRef.current.scrollWidth,
          height: printRef.current.scrollHeight,
          style: { marginTop: 0 },
        })
        .then(url => saveAs(url, `${name}.png`)),
    [],
  );

  // 切换后重置滚动
  useEffect(() => {
    if (drawerRef.current) {
      const drawerPaperNode = drawerRef.current.querySelector('#detailViewPaper');
      if (drawerPaperNode) {
        drawerPaperNode.scrollTop = 0;
      }
    }
  }, [id]);

  return (
    <Drawer
      sx={{ zIndex: 1301 }}
      PaperProps={{ id: 'detailViewPaper', style: { minWidth: 650 } }}
      ref={drawerRef}
      anchor={anchor}
      BackdropProps={{ invisible: true }}
      open={show}
      // ModalProps={{ BackdropProps: { invisible: true }}}
      onClose={() => setDetailView({ show: false })}
    >
      <div style={{ width: 600, display: 'flex', position: 'absolute', overflowX: 'auto' }}>
        {detailCacheIds.length > 0 &&
          detailCacheIds.map((id, index) => {
            const { name, imgData } = dataHelper.getObjDisplayInfoById(id);
            return (
              <CyanTooltip key={id + index} title={name} fontSize={0.875}>
                <IconImage size={24} src={imgData} pointer onClick={() => setDetailView({ id })} />
              </CyanTooltip>
            );
          })}
      </div>

      <div ref={printRef} style={{ marginTop: 24 }}>
        <Intro id={id} doCopy={doCopy} doExport={doExport} />
      </div>
    </Drawer>
  );
};

export default Detail;
