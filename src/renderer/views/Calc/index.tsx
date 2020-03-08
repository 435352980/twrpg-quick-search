import { clipboard, nativeImage } from 'electron';
import React, { FC } from 'react';
import { Drawer, Button, AppBar, Toolbar } from '@material-ui/core';
import { message } from '@renderer/helper';
import htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { useStoreActions, useStoreState } from '@renderer/store';
import styled from '@emotion/styled';
import local from '@renderer/local';
import CalcItems from './CalcItem';

const ExportTarget = styled.div`
  padding-left: 8px;
  padding-bottom: 8px;
`;

interface CalcViewProps {
  anchor: 'left' | 'right';
  show: boolean;
}

const HeaderBar = styled(AppBar)`
  display: flex;
  align-items: center;
  background: repeating-linear-gradient(
    135deg,
    #2b3284,
    #2b3284 10%,
    #4177bc 10%,
    #4177bc 17%,
    #2b3284 17%,
    #2b3284 27%,
    #4177bc 27%,
    #ffffff 20%,
    #4177bc 21%,
    #4177bc 45%,
    #ffffff 45%,
    #ffffff 45%
  );
`;

const Calc: FC<CalcViewProps> = ({ anchor, show }) => {
  const printRef = React.createRef<HTMLDivElement>();
  const { ids, haves } = useStoreState(state => state.view.calc);
  const setCalcView = useStoreActions(actions => actions.view.setCalcView);
  // if (!ids || !haves) {
  //     return <div />;
  // }

  return (
    <Drawer
      PaperProps={{ style: { minWidth: 500 } }}
      BackdropProps={{ invisible: true }}
      anchor={anchor}
      open={show}
      onClose={() => setCalcView({ show: false })}
    >
      <HeaderBar position="static">
        <Toolbar>
          <Button
            color="inherit"
            onClick={() => {
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
          >
            {local.common.copy}
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              printRef.current &&
                htmlToImage
                  .toPng(printRef.current, {
                    quality: 1,
                    backgroundColor: 'white',
                    width: printRef.current.scrollWidth,
                    height: printRef.current.scrollHeight,
                  })
                  .then(url => saveAs(url, `${local.common.calcInfo}.png`));
            }}
          >
            {local.common.save}
          </Button>
        </Toolbar>
      </HeaderBar>

      <ExportTarget ref={printRef}>
        <CalcItems targetIds={ids || []} haveIds={haves || []} />
      </ExportTarget>
    </Drawer>
  );
};
export default Calc;
