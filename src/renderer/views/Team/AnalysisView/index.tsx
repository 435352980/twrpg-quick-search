import React from 'react';
import { makeStyles } from '@material-ui/core';
import { AppBar, Toolbar, IconButton, Typography, Dialog, Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import AnalysisChart from './AnalysisChart';

const useStyles = makeStyles({
  appBar: {
    position: 'fixed',
    backgroundImage:
      'repeating-linear-gradient(135deg, #2B3284, #2B3284 10%, #4177BC 10%, #4177BC 17%, #2B3284 17%, #2B3284 27%, #4177BC 27%, #FFFFFF 20%, #4177BC 21%, #4177BC 45%, #FFFFFF 45%, #FFFFFF 45%)',
  },
  flex: {
    flex: 1,
  },
});

const AnalysisView = ({ players, show, handleClose }) => {
  const classes = useStyles();
  return (
    <Dialog
      fullScreen
      // classes={{ root: classes.dialogRoot }}
      open={show}
      onClose={() => handleClose()}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
    >
      <AppBar className={classes.appBar} elevation={0}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => handleClose()} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <Typography align="center" variant="h6" color="inherit" className={classes.flex}>
            各成员需求分析图
          </Typography>
        </Toolbar>
      </AppBar>
      {players && players.length ? <AnalysisChart players={players} /> : null}
    </Dialog>
  );
};
export default AnalysisView;
