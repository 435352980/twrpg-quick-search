import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import muiGreen from '@material-ui/core/colors/green';

import Select from 'react-dropdown-select';
import { getDb, getImage } from '@/db';

const useStyles = makeStyles({
  select: {
    height: 39,
    background: '#00bcd4',
    color: 'white',
    userSelect: 'none',
  },
  contentText: { fontWeight: 'bold', cursor: 'default', userSelect: 'none' },
  selectOptionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    color: '#000',
    alignItems: 'center',
    float: 'left',
    cursor: 'pointer',
  },
  selectOptionDesc: {
    width: 64,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  },
  check: {
    position: 'absolute',
    transform: 'translate(0%, 80%)',
    pointerEvents: 'none',
    background: '#fff',
    color: muiGreen.A700,
    opacity: 0.9,
  },
});

const options = getDb('heroes')
  .getAll()
  .filter(hero => hero.name)
  .map(hero => ({ label: hero.name, value: hero.id }));

const HeroSelect = ({ placeholder, onChange }: any) => {
  const classes = useStyles();
  return (
    <Select
      className={classes.select}
      // multi
      separator
      clearable
      searchable={false}
      placeholder=""
      dropdownHeight="330px"
      portal={document.body}
      options={options}
      contentRenderer={({ props, state, methods }: any) => {
        const length = state.values.length;
        return (
          <Typography variant="body2" align="center" noWrap className={classes.contentText}>
            {`${length ? `${placeholder}-${state.values[0].label}` : placeholder}`}
          </Typography>
        );
      }}
      dropdownRenderer={({ props, state, methods }: any) => (
        <div>
          {options.map(item => {
            const { addItem, isSelected } = methods;
            const selected = isSelected(item);
            const hero = getDb('heroes').find('id', item.value);
            return (
              <div
                key={item.value}
                className={classes.selectOptionWrapper}
                onClick={() => addItem(item)}
              >
                <img alt={hero.name} src={getImage(hero.img)} />
                {selected ? <CheckCircleIcon color="primary" className={classes.check} /> : null}
                <div className={classes.selectOptionDesc}>{item.label}</div>
              </div>
            );
          })}
        </div>
      )}
      onChange={(values: any[]) => {
        if (onChange) {
          onChange(values.map(item => item.value));
        }
      }}
    />
  );
};

export default HeroSelect;
