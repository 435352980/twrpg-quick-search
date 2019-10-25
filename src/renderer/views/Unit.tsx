import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { Table, Column } from 'react-virtualized';
// import drops from '../data/drops'

import ReactTooltip from 'react-tooltip';

import { RouteComponentProps } from '@reach/router';
import { orderBy } from 'lodash';
import CachePanel from './CachePanel';
import { getAnchor, getStageName } from '@/utils/common';
import useWindowSize from '@/hooks/useWindowSize';
import { getDb, getImage } from '@/db';

import { unitFieldsConfig } from '@/configs';
import { blueTip, tableStyle } from '@/theme/common';
import { useStoreActions } from '@/store';
import Footer from '@/views/Footer';
import Cell from '@/components/Cell';
// import saveAs from 'file-saver';

// import Footer from './Footer';

interface SimpleJson {
  [propName: string]: string;
}

const useStyles = makeStyles({
  //table 基础样式
  table: tableStyle,
  //Table header基础样式
  header: {
    color: 'white',
    fontSize: '1rem',
    textAlign: 'center',
    userSelect: 'none',
  },
  tip: { color: '#000!important', ...blueTip, fontSize: '1rem' },
  img: { width: 48, height: 48 },
  imgSmall: { width: 48, height: 48, cursor: 'pointer' },
  changeColumn: {
    width: '100%',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    '& >p': {
      fontWeight: 700,
    },
  },
  filterHeaderWrapper: {
    background: '#00bcd4',
    color: 'white',
    userSelect: 'none',
  },
  filterTypeBtn: {
    padding: '0 8px',
    margin: 0,
    minHeight: 0,
    minWidth: 'max-content',
    fontSize: '1rem',
    fontWeight: 700,
  },
});

// const units = getDb('units').getAll();

const mdxConfig: SimpleJson = {
  n03S: 'HeroDracoRich.mdx',
  n01N: 'AvengingAngel.mdx',
};

const descSort = (key: keyof Unit) => (unit: Unit) => (unit[key] ? unit[key] : -1);
// const ascSort = (key: keyof Unit) => (unit: Unit) => (unit[key] ? unit[key] : 99);

const Unit: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();
  const { innerWidth, innerHeight } = useWindowSize();
  const [filterType, setFilterType] = useState<number | null | undefined>(null);
  // const cacheVersion = useStoreState(state => state.good.cacheVersion);
  const addCacheId = useStoreActions(actions => actions.good.addCacheId);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const setMdxView = useStoreActions(actions => actions.view.setMdxView);

  const units = orderBy(
    filterType !== null
      ? getDb('units').filter(unit => unit.stage === filterType)
      : getDb('units').getAll(),
    [descSort('stage')],
    ['desc'],
  );
  return (
    <div>
      <CachePanel disableRight />
      <Table
        className={classes.table}
        headerClassName={classes.header}
        width={innerWidth}
        height={innerHeight - 216}
        headerHeight={40}
        rowHeight={64}
        rowCount={units.length}
        rowStyle={{ alignItems: 'stretch' }}
        rowGetter={({ index }) => units[index]}
        onScroll={() => ReactTooltip.hide()}
      >
        <Column
          label="序号"
          dataKey="no"
          width={50}
          cellRenderer={({ rowIndex }) => (
            <Cell>
              <Typography variant="body1" align="center">
                {rowIndex + 1}
              </Typography>
            </Cell>
          )}
        />

        <Column
          label="图片"
          dataKey="img"
          width={64}
          cellRenderer={({ rowData }) => {
            const unit = rowData as Unit;
            return (
              <Cell
                data-place="right"
                data-tip={Object.entries(unitFieldsConfig)
                  .reduce((acc: string[], [key, name]) => {
                    const value = unit[key as keyof Unit];
                    return value ? [...acc, `【${name}】【${value}】`] : acc;
                  }, [])
                  .join('<br>')}
                onMouseEnter={() => ReactTooltip.rebuild()}
              >
                <img
                  alt=""
                  onClick={() => {
                    if (mdxConfig[unit.id]) {
                      setMdxView({ show: true, name: mdxConfig[unit.id] });
                    }
                  }}
                  className={classes.img}
                  src={getImage(unit.img)}
                />
              </Cell>
            );
          }}
        />
        <Column
          label="名称"
          dataKey="name"
          width={300}
          cellRenderer={({ cellData }) => {
            return (
              <Cell>
                <Typography variant="body1" align="center">
                  {cellData}
                </Typography>
              </Cell>
            );
          }}
        />
        <Column
          label="阶段"
          dataKey="name"
          width={80}
          cellRenderer={({ rowData }) => {
            const unit = rowData as Unit;
            return (
              <Cell>
                <Typography variant="body1" color="secondary" align="center">
                  {unit.stageDesc}
                </Typography>
              </Cell>
            );
          }}
        />
        <Column
          label="阶段"
          dataKey="stage"
          width={200}
          flexGrow={1}
          headerRenderer={() => (
            <Cell className={classes.filterHeaderWrapper}>
              <Button
                className={classes.filterTypeBtn}
                color="inherit"
                onClick={() => setFilterType(null)}
              >
                全部
              </Button>
              {[6, 5, 4, 3, 2, 1].map(value => (
                <Button
                  key={value}
                  className={classes.filterTypeBtn}
                  color="inherit"
                  onClick={() => setFilterType(value)}
                >
                  {getStageName(value)}
                </Button>
              ))}
              <Button
                className={classes.filterTypeBtn}
                color="inherit"
                onClick={() => setFilterType(undefined)}
              >
                其他
              </Button>
            </Cell>
          )}
          cellRenderer={({ rowData }) => {
            const unit = rowData as Unit;
            // const source = drops.find(drop => drop.unitKey === unit.unitKey)
            const dps = unit.drop || [];
            return (
              <Cell>
                {dps.map(item => {
                  const { id, name, img, desc } = item;
                  return (
                    <img
                      alt=""
                      key={id}
                      data-tip={`${name}【${desc}】`}
                      onMouseEnter={() => ReactTooltip.rebuild()}
                      className={classes.imgSmall}
                      src={getImage(img)}
                      onClick={e =>
                        setDetailView({
                          id,
                          show: true,
                          anchor: getAnchor(e),
                          isGood: true,
                        })
                      }
                      onContextMenu={() => addCacheId(id)}
                    />
                  );
                })}
              </Cell>
            );
          }}
        />
      </Table>
      <Footer />
      <ReactTooltip multiline place="top" type="warning" effect="solid" className={classes.tip} />
    </div>
  );
};
export default Unit;
