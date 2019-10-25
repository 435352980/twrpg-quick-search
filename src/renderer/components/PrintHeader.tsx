import React from 'react';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { AppBar, Toolbar, Button, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

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

interface PrintHeaderProps {
  title: string;
  handleClose: Function;
  handleSave: Function;
  handleCopy: Function;
}

const PrintHeader: React.FC<PrintHeaderProps> = ({
  title,
  handleClose,
  handleSave,
  handleCopy,
}) => {
  const classes = useStyles();
  return (
    <AppBar className={classes.appBar} elevation={0}>
      <Toolbar>
        <IconButton color="inherit" onClick={() => handleClose()} aria-label="Close">
          <CloseIcon />
        </IconButton>
        <Typography align="center" variant="h6" color="inherit" className={classes.flex}>
          {title}
        </Typography>
        <Button color="inherit" onClick={() => handleCopy()}>
          复制
        </Button>
        <Button color="inherit" onClick={() => handleSave()}>
          保存
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default PrintHeader;
