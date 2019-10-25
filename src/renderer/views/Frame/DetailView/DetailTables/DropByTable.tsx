import React from 'react';
import { CardHeader, CardContent } from '@material-ui/core';
import ReactTable, { Column } from 'react-table';
import tableConfig from './tableConfig';
import SimpleCell from './SimpleCell';
import ImageCell from './ImageCell';
import { useStoreActions } from '@/store';

const DropFromTable: React.FC<{ data: DropFrom[] | null | undefined }> = ({ data }) => {
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  if (!data) {
    return <div />;
  }

  const columns: Column<DropFrom>[] = [
    {
      Header: <SimpleCell>图片</SimpleCell>,
      accessor: 'img',
      Cell: row => (
        <ImageCell
          {...row.original}
          cursor={false}
          onClick={() => {
            setDetailView({ id: row.original.id, isGood: false });
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
      Header: <SimpleCell>概率</SimpleCell>,
      accessor: 'desc',
      Cell: row => <SimpleCell>{row.value}</SimpleCell>,
      // width: 120
    },
  ];

  return (
    <React.Fragment>
      <CardHeader title="获取方式(掉落)" />
      <CardContent>
        <ReactTable {...tableConfig} pageSize={data.length} columns={columns} data={data} />
      </CardContent>
    </React.Fragment>
  );
};

export default DropFromTable;
