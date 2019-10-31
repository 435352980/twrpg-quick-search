import path from 'path';
import fs from 'fs';
import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { TextField, Paper, Button, Typography } from '@material-ui/core';
import { Collection, AutoSizer } from 'react-virtualized';

import { orderBy } from 'lodash';
import { getDb, getImage } from '@/db';
import getSaveGoods from '@/utils/getSaveGoods';
import { useStoreState } from '@/store';

// import GoodSelectPanel from './GoodSelectPanel';

const useStyles = makeStyles(theme => ({
  selectWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: 650,
    flex: 1,
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    background: grey['100'],
    // marginTop: theme.spacing.unit * 2,
    marginBottom: 16,
    padding: 8,
  },
  goodsContainer: {
    flex: 1,
    overflowY: 'auto',
    width: '100%',
    background: grey['100'],
    // marginTop: theme.spacing.unit * 2,
    // marginBottom: theme.spacing.unit * 2,
    padding: 8,
  },
  button: {
    margin: 4,
    flex: 1,
    background: 'linear-gradient(132deg, #68ade2 0, #55b0ff 100%)',
    boxShadow: '0 1px 2px 1px rgba(33, 203, 243, .3)',
  },
  goodItemWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  goodItemImg: {
    width: 64,
    cursor: 'pointer',
  },
  goodItemDesc: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    width: '100%',
  },
  drag: {
    position: 'fixed',
    zIndex: 1,
  },
  contentWrapper: {
    marginTop: 8,
  },
}));

const CELL_WIDTH = 195;
const CELL_HEIGHT = 105;
const LINE_SIZE = 3;

// const { name, img, quality, level, cat, type, effect, hc, make } = base.find(item => item.name === '上古遗篇');
const descSort = (key: keyof Good) => (good: Good) => (good[key] ? good[key] : -1);
const ascSort = (key: keyof Good) => (good: Good) => (good[key] ? good[key] : 99);
interface SelectPanelProps {
  handleChange: (good: Good) => void;
}
const SelectPanel: React.FC<SelectPanelProps> = ({ handleChange }) => {
  const classes = useStyles();
  const [searchSource, setSearchSource] = useState(
    orderBy(
      getDb('goods').filter(item => item.cat && item.cat.includes('weapon')),
      [ascSort('goodType'), descSort('stage'), descSort('level'), descSort('quality')],
      ['asc', 'desc', 'desc', 'desc'],
    ),
  );
  const setSearchType = useCallback(type => {
    setSearchSource(
      orderBy(
        getDb('goods').filter(item => item.cat && item.cat.includes(type)),
        [ascSort('goodType'), descSort('stage'), descSort('level'), descSort('quality')],
        ['asc', 'desc', 'desc', 'desc'],
      ),
    );
  }, []);
  const cacheIds = useStoreState(state => state.good.cacheIds);
  const war3Path = useStoreState(state => state.app.war3Path);
  const selectedFile = useStoreState(state => state.common.selectedFile);

  const isExists =
    war3Path && selectedFile
      ? fs.existsSync(path.join(war3Path, 'twrpg', `${selectedFile}.txt`))
      : false;
  return (
    <div className={classes.selectWrapper}>
      <TextField
        label="检索"
        fullWidth
        margin="dense"
        variant="outlined"
        onChange={e => {
          const value = e.target.value;
          setSearchSource(
            orderBy(
              !value
                ? getDb('goods').filter(item => item.cat && item.cat.includes('weapon'))
                : getDb('goods')
                    .getAll()
                    .filter(good => good.name.includes(value)),
              [ascSort('goodType'), descSort('stage'), descSort('level'), descSort('quality')],
              ['asc', 'desc', 'desc', 'desc'],
            ),
          );
        }}
      />
      <Paper elevation={0} className={classes.root}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={e => {
            if (war3Path && selectedFile && isExists) {
              const source = fs
                .readFileSync(path.join(war3Path, 'twrpg', `${selectedFile}.txt`))
                .toString();
              const [panel = [], bag = [], store = [], dust = []] = getSaveGoods(source);
              setSearchSource(
                [...panel, ...bag, ...store, ...dust].reduce((acc: Good[], name) => {
                  const good = getDb('goods').find('name', name);
                  if (good) {
                    acc.push(good);
                  }
                  return acc;
                }, []),
              );
            } else {
              setSearchSource([]);
            }
          }}
        >
          存档
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={e => setSearchSource(cacheIds.map(id => getDb('goods').find('id', id)))}
        >
          缓存
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={e => setSearchType('weapon')}
        >
          武器
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={e => setSearchType('hat')}
        >
          头盔
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={e => setSearchType('armor')}
        >
          衣服
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={e => setSearchType('jewelry')}
        >
          饰品
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={e => setSearchType('wing')}
        >
          翅膀
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={e => setSearchType('material')}
        >
          材料
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={e => setSearchType('badge')}
        >
          徽章
        </Button>
      </Paper>
      <AutoSizer>
        {({ width, height }) => (
          <Collection
            cellCount={searchSource.length}
            cellRenderer={({ index, isScrolling, key, style }) => {
              const good = searchSource[index];
              return (
                <div key={key} style={style} className={classes.goodItemWrapper}>
                  <img
                    alt=""
                    className={classes.goodItemImg}
                    src={getImage(good.img)}
                    onClick={() => handleChange(good)}
                  />
                  <Typography variant="body1" className={classes.goodItemDesc}>
                    {good.name}
                  </Typography>
                </div>
              );
            }}
            cellSizeAndPositionGetter={({ index }) => {
              const no = index + 1;
              return {
                height: CELL_HEIGHT,
                width: CELL_WIDTH,
                x: ((no % LINE_SIZE || LINE_SIZE) - 1) * CELL_WIDTH,
                y: ((no - (no % LINE_SIZE || LINE_SIZE)) / LINE_SIZE) * CELL_HEIGHT,
              };
            }}
            height={height - 140}
            horizontalOverscanSize={0}
            noContentRenderer={() => <div>无结果</div>}
            // verticalOverscanSize={100}
            width={width}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default SelectPanel;
