import { clipboard, nativeImage } from 'electron';
import React from 'react';
import { Dialog, Slide } from '@material-ui/core';
import { notification } from 'antd';
import htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { makeStyles } from '@material-ui/core';
import PrintHeader from './PrintHeader';

const useStyles = makeStyles({
  dialogRoot: { zIndex: 100 },
  drawer: { width: 683 },
  exportTarget: { paddingTop: 72, paddingLeft: 8, paddingBottom: 8 },
});

interface PrintDialogProps {
  name: string;
  show: boolean;
  onClose: () => void;
}

const PrintDialog: React.FC<PrintDialogProps> = ({ name, show, onClose, children }) => {
  const classes = useStyles();
  const printRef = React.createRef<HTMLDivElement>();
  return (
    <Dialog
      fullScreen
      classes={{ root: classes.dialogRoot }}
      open={show}
      onClose={onClose}
      TransitionComponent={Slide as any}
      TransitionProps={{ direction: 'up' } as any}
    >
      <PrintHeader
        title={name}
        handleClose={onClose}
        handleCopy={() => {
          printRef.current &&
            htmlToImage
              .toPng(printRef.current, {
                quality: 1,
                backgroundColor: 'white',
              })
              .then(url => {
                clipboard.writeImage(nativeImage.createFromDataURL(url));
                notification.success({
                  duration: 1,
                  placement: 'topLeft',
                  description: name,
                  message: '图片已复制至剪切板',
                });
              });
        }}
        handleSave={() => {
          printRef.current &&
            htmlToImage
              .toPng(printRef.current, {
                quality: 1,
                backgroundColor: 'white',
              })
              .then(url => {
                saveAs(url, `${name}.png`);
              });
        }}
      />

      <div className={classes.exportTarget} ref={printRef}>
        {children}
      </div>
    </Dialog>
  );
};

export default PrintDialog;
