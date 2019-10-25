import React from 'react';
import { makeStyles } from '@material-ui/core';
import Button, { ButtonProps } from '@material-ui/core/Button';

const useStyles = makeStyles({
  blueBtn: {
    margin: 4,
    flex: 1,
    fontSize: '1rem',
    border: 0,
    borderRadius: 3,
    background: 'linear-gradient(132deg, #68ade2 0%, #55b0ff 100%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
  },
  redBtn: {
    margin: 4,
    flex: 1,
    fontSize: '1rem',
    border: 0,
    borderRadius: 3,
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
  },
});

const ColorBtn: React.FC<Omit<ButtonProps, 'color'> & { color: string }> = props => {
  const { color, className = '', ...other } = props;
  const classes = useStyles();
  return (
    <Button
      className={`${color === 'red' ? classes.redBtn : classes.blueBtn} ${className}`}
      {...other}
    />
  );
};

export default ColorBtn;
