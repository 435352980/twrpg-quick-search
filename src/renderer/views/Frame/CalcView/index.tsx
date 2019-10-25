import { clipboard, nativeImage } from 'electron';
import React, { FC } from 'react';
// import PropTypes from 'prop-types';
import { Drawer, Button, AppBar, Toolbar } from '@material-ui/core';
import { notification } from 'antd';
import htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { makeStyles } from '@material-ui/core';
import CalcItems from './CalcItems';
import { useStoreActions, useStoreState } from '@/store';

const useStyles = makeStyles({
  drawerRoot: { minWidth: 500 },
  appBar: {
    display: 'flex',
    flexDirecton: 'row',
    alignItems: 'center',
    background:
      'repeating-linear-gradient(135deg, #2B3284, #2B3284 10%, #4177BC 10%, #4177BC 17%, #2B3284 17%, #2B3284 27%, #4177BC 27%, #FFFFFF 20%, #4177BC 21%, #4177BC 45%, #FFFFFF 45%, #FFFFFF 45%)',
  },
  exportTarget: { paddingLeft: 8, paddingBottom: 8, maxWidth: 780 },
});

interface CalcViewProps {
  anchor: 'left' | 'right';
  show: boolean;
}

const CalcView: FC<CalcViewProps> = ({ anchor, show }) => {
  const classes = useStyles();
  const printRef = React.createRef<HTMLDivElement>();
  const { ids, haves } = useStoreState(state => state.view.calc);
  const setCalcView = useStoreActions(actions => actions.view.setCalcView);
  // if (!ids || !haves) {
  //     return <div />;
  // }

  return (
    <Drawer
      classes={{ paper: classes.drawerRoot }}
      BackdropProps={{ invisible: true }}
      anchor={anchor}
      open={show}
      onClose={() => setCalcView({ show: false })}
    >
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <Button
            color="inherit"
            onClick={() => {
              printRef.current &&
                htmlToImage
                  .toPng(printRef.current, { quality: 1, backgroundColor: 'white' })
                  .then(url => {
                    clipboard.writeImage(nativeImage.createFromDataURL(url));
                    notification.success({
                      duration: 1,
                      placement: anchor === 'right' ? 'topLeft' : 'topRight',
                      description: '计算明细',
                      message: '图片已复制至剪切板',
                    });
                  });
            }}
          >
            复制
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              printRef.current &&
                htmlToImage
                  .toPng(printRef.current, { quality: 1, backgroundColor: 'white' })
                  .then(url => saveAs(url, '计算明细.png'));
            }}
          >
            保存
          </Button>
        </Toolbar>
      </AppBar>

      <div className={classes.exportTarget} ref={printRef}>
        <CalcItems targetIds={ids || []} haveIds={haves || []} />
      </div>
    </Drawer>
  );
};
export default CalcView;
