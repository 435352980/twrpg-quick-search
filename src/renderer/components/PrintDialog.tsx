import { clipboard, nativeImage } from 'electron';
import React, { PropsWithChildren } from 'react';
import { Dialog, Slide } from '@mui/material';
import { message } from '@renderer/helper';
import htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import PrintHeader from '@renderer/components/PrintHeader';
import styled from '@emotion/styled';
import { useStoreState } from '@renderer/store';

interface PrintDialogProps {
  name: string;
  show: boolean;
  onClose: () => void;
}

const ExportTarget = styled.div`
  padding-top: 72px;
  padding-left: 8px;
  padding-bottom: 8px;
`;

const PrintDialog: React.FC<PropsWithChildren<PrintDialogProps>> = ({
  name,
  show,
  onClose,
  children,
}) => {
  const local = useStoreState(state => state.app.local);
  const printRef = React.createRef<HTMLDivElement>();
  return (
    <Dialog
      fullScreen
      open={show}
      onClose={onClose}
      TransitionComponent={Slide as any}
      TransitionProps={{ direction: 'up' } as any}
    >
      <PrintHeader
        local={local}
        title={name}
        handleClose={onClose}
        handleCopy={() => {
          printRef.current &&
            htmlToImage
              .toPng(printRef.current, {
                quality: 1,
                backgroundColor: 'white',
                width: printRef.current.scrollWidth,
                height: printRef.current.scrollHeight,
              })
              .then(url => {
                clipboard.writeImage(nativeImage.createFromDataURL(url));
                message.success(local.common.copyImageSuccess);
              });
        }}
        handleSave={() => {
          printRef.current &&
            htmlToImage
              .toPng(printRef.current, {
                quality: 1,
                backgroundColor: 'white',
                width: printRef.current.scrollWidth,
                height: printRef.current.scrollHeight,
              })
              .then(url => {
                saveAs(url, `${name}.png`);
              });
        }}
      />

      <ExportTarget ref={printRef}>{children}</ExportTarget>
    </Dialog>
  );
};

export default PrintDialog;
