import React from 'react';
import { CardHeader, CardContent } from '@material-ui/core';
import ReactTable, { Column } from 'react-table';
import tableConfig from './tableConfig';
import SimpleCell from './SimpleCell';
import ImageCell from './ImageCell';
import { useStoreActions } from '@/store';

const MakeToTable: React.FC<{ data: MakeTo[] | null | undefined }> = ({ data }) => {
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const addCacheId = useStoreActions(actions => actions.good.addCacheId);
  if (!data) {
    return <div />;
  }

  const columns: Column<MakeTo>[] = [
    {
      Header: <SimpleCell>图片</SimpleCell>,
      accessor: 'img',
      Cell: row => (
        <ImageCell
          {...row.original}
          onClick={id => setDetailView({ id, isGood: true })}
          onContextMenu={id => addCacheId(id)}
        />
      ),
      width: 48,
    },
    {
      Header: <SimpleCell>名称</SimpleCell>,
      accessor: 'name',
      Cell: row => <SimpleCell>{row.value}</SimpleCell>,
    },
  ];

  return (
    <React.Fragment>
      <CardHeader title="装备进阶" />
      <CardContent>
        <ReactTable {...tableConfig} pageSize={data.length} columns={columns} data={data} />
      </CardContent>
    </React.Fragment>
  );
};

export default MakeToTable;
