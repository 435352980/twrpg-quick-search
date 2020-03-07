import React from 'react';
import { AppBar, Toolbar, Button, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import local from '@renderer/local';
import styled from '@emotion/styled';

interface PrintHeaderProps {
  title: string;
  handleClose: Function;
  handleSave: Function;
  handleCopy: Function;
}

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

const PrintHeader: React.FC<PrintHeaderProps> = ({
  title,
  handleClose,
  handleSave,
  handleCopy,
}) => {
  return (
    <HeaderBar>
      <Toolbar>
        <IconButton color="inherit" onClick={() => handleClose()} aria-label="Close">
          <CloseIcon />
        </IconButton>
        <Typography align="center" variant="h6" color="inherit" style={{ flex: 1 }}>
          {title}
        </Typography>
        <Button color="inherit" onClick={() => handleCopy()}>
          {local.COMMON.COPY}
        </Button>
        <Button color="inherit" onClick={() => handleSave()}>
          {local.COMMON.SAVE}
        </Button>
      </Toolbar>
    </HeaderBar>
  );
};

export default PrintHeader;
