import { clipboard, nativeImage } from 'electron';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Drawer } from '@material-ui/core';
import htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { notification } from 'antd';
import DetailTables from './DetailTables';
import GoodIntro from './GoodIntro';
import BossDrop from './BossDrop';
import { useStoreActions } from '@/store';

interface DetailViewProps {
  /**
   * 展示类别，true=物品,false=单位
   */
  isGood: boolean;
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

const useStyles = makeStyles({
  drawerPaper: { maxWidth: 683 },
});

const DetailView: React.FC<DetailViewProps> = ({ isGood, id, anchor, show }) => {
  const classes = useStyles();
  const printRef = React.createRef<HTMLDivElement>();
  const [drawerNode, setDrawerNode] = useState<HTMLDivElement | null>(null);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  useEffect(() => {
    if (drawerNode) {
      const drawerPaperNode = drawerNode.querySelector(`.${classes.drawerPaper}`);
      if (drawerPaperNode) {
        drawerPaperNode.scrollTop = 0;
      }
    }
  }, [isGood, id, anchor, drawerNode, classes.drawerPaper]);
  return (
    <Drawer
      classes={{ paper: classes.drawerPaper }}
      anchor={anchor as 'left' | 'right'}
      BackdropProps={{ invisible: true }}
      open={show}
      ref={(node: HTMLDivElement) => setDrawerNode(node)}
      // ModalProps={{ BackdropProps: { invisible: true }}}
      onClose={() => setDetailView({ show: false })}
    >
      <div ref={printRef}>
        {isGood ? (
          <React.Fragment>
            <GoodIntro
              id={id}
              handleCopy={(name: string) => {
                printRef.current &&
                  htmlToImage
                    .toPng(printRef.current, { quality: 1, backgroundColor: 'white' })
                    .then(url => {
                      clipboard.writeImage(nativeImage.createFromDataURL(url));
                      notification.success({
                        duration: 1,
                        placement: anchor === 'left' ? 'topRight' : 'topLeft',
                        description: name,
                        message: '图片已复制至剪切板',
                      });
                    });
              }}
              handleExport={(name: string) =>
                printRef.current &&
                htmlToImage
                  .toPng(printRef.current, {
                    quality: 1,
                    backgroundColor: 'white',
                  })
                  .then(url => saveAs(url, `${name}.png`))
              }
            />
            <DetailTables id={id} />
          </React.Fragment>
        ) : (
          <BossDrop
            id={id}
            anchor={anchor}
            handleCopy={(name: string) => {
              printRef.current &&
                htmlToImage
                  .toPng(printRef.current, { quality: 1, backgroundColor: 'white' })
                  .then(url => {
                    clipboard.writeImage(nativeImage.createFromDataURL(url));
                    notification.success({
                      duration: 1,
                      placement: anchor === 'left' ? 'topRight' : 'topLeft',
                      description: name,
                      message: '图片已复制至剪切板',
                    });
                  });
            }}
            handleExport={(name: string) =>
              printRef.current &&
              htmlToImage
                .toPng(printRef.current, {
                  quality: 1,
                  backgroundColor: 'white',
                })
                .then(url => saveAs(url, `${name}.png`))
            }
          />
        )}
      </div>
    </Drawer>
  );
};

export default DetailView;
