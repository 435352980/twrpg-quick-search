import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Dialog, Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import styled from '@emotion/styled';
import AnalysisChart from './AnalysisChart';

const HeaderBar = styled(AppBar)`
  position: fixed;
  background-image: repeating-linear-gradient(
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

const AnalysisView = ({ members, show, handleClose, local }) => {
  return (
    <Dialog
      fullScreen
      open={show}
      onClose={() => handleClose()}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' } as any}
    >
      <HeaderBar elevation={0}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => handleClose()} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <Typography align="center" variant="h6" color="inherit" style={{ flex: 1 }}>
            {local.views.team.analysisTitle}
          </Typography>
        </Toolbar>
      </HeaderBar>
      {members && members.length ? <AnalysisChart members={members} /> : null}
    </Dialog>
  );
};
export default AnalysisView;
