import React, { FC, HTMLProps } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: 8,
    height: '100%',
  },
});

const Cell: FC<HTMLProps<HTMLDivElement>> = ({ className = '', children, ...rest }) => {
  const classes = useStyles();
  return (
    <div {...rest} className={clsx(className, classes.root)}>
      {children}
    </div>
  );
};

export default Cell;
