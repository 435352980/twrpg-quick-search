import React from 'react';
import { CardHeader, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import ReactTable, { Column } from 'react-table';
import { orderBy } from 'lodash';
import tableConfig from './tableConfig';
import SimpleCell from './SimpleCell';
import ImageCell from './ImageCell';
import { useStoreActions, useStoreState } from '@/store';

const useStyles = makeStyles({ pointer: { cursor: 'pointer' } });

const BuildFromTable: React.FC<{ data: BuildFrom[] | undefined | null }> = ({ data }) => {
  const classes = useStyles();
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const addCacheId = useStoreActions(actions => actions.good.addCacheId);

  const selectedTarget = useStoreState(state => state.common.selectedTarget);
  const addTargetItem = useStoreActions(actions => actions.common.addTargetItem);
  if (!data) {
    return <div />;
  }

  const columns: Column<BuildFrom>[] = [
    {
      Header: <SimpleCell>图片</SimpleCell>,
      accessor: 'img',
      Cell: row => (
        <ImageCell
          {...row.original}
          onClick={id => setDetailView({ id, isGood: true })}
          onContextMenu={id => {
            if (selectedTarget) {
              addTargetItem(id);
            } else {
              addCacheId(id);
            }
          }}
        />
      ),
      width: 48,
    },
    {
      Header: <SimpleCell>名称</SimpleCell>,
      accessor: 'name',
      Cell: row => <SimpleCell>{row.value}</SimpleCell>,
      maxWidth: 240,
    },
    {
      Header: <SimpleCell>关联BOSS</SimpleCell>,
      accessor: 'dropFrom',
      Cell: row =>
        row.value
          ? (row.value as DropFrom[]).map(dp => (
              <SimpleCell
                key={dp.id}
                className={classes.pointer}
                // temp用于快捷跳转返回
                onClick={() => setDetailView({ id: dp.id, isGood: false })}
              >
                {dp.name + (row.original.chanceOnName ? `(${dp.desc})` : '')}
              </SimpleCell>
            ))
          : null,
      // width: 120
    },
    {
      Header: <SimpleCell>概率/数量</SimpleCell>,
      accessor: 'dropFrom',
      Cell: row =>
        row.value && !row.original.chanceOnName ? (
          (row.value as DropFrom[]).map(dp => (
            <SimpleCell key={dp.id}>{dp.desc + (row.original.choose ? '(可选)' : '')}</SimpleCell>
          ))
        ) : (
          <SimpleCell>{row.original.num + (row.original.choose ? '(可选)' : '')}</SimpleCell>
        ),
      // minWidth: 120
    },
  ];

  return (
    <React.Fragment>
      <CardHeader title="获取方式(锻造)" />
      <CardContent>
        <ReactTable
          {...tableConfig}
          pageSize={data.length}
          columns={columns}
          data={orderBy(data, ['choose'], ['asc'])}
        />
      </CardContent>
    </React.Fragment>
  );
};

export default BuildFromTable;
