import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Avatar, Card, CardHeader, CardContent, Typography } from '@material-ui/core';
import ReactTable, { Column } from 'react-table';

import { getDb, getImage } from '@/db';
import { useStoreActions } from '@/store';

const useStyles = makeStyles({
  drawerPaper: {
    maxWidth: 683,
  },
  card: {
    overflow: 'visible',
    boxShadow: 'none',
    width: 650,
  },
  title: { cursor: 'pointer' },
  avatar: {
    cursor: 'pointer',
  },
  imgPointer: { width: 40, height: 40, cursor: 'pointer' },
});
const tableConfig = {
  // className: '-striped -highlight',
  className: '-highlight',
  // style: { width: 680 }, // 683
  resizable: false,
  getTdProps: () => ({
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
  }),
  showPagination: false,
  sortable: false,
  NoDataComponent: () => null,
};

const BossDropView = ({ id, handleCopy, handleExport }: any) => {
  const classes = useStyles();
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const addCacheId = useStoreActions(actions => actions.good.addCacheId);
  if (!id) {
    return <div />;
  }
  const { name, img, drop, stageDesc } = getDb('units').find('id', id);

  const SimpleCell = (props: any) => <Typography variant="body1" {...props} />;

  const columns: Column<BossDrop>[] = [
    {
      Header: <SimpleCell>图片</SimpleCell>,
      accessor: 'img',
      Cell: row => (
        <img
          alt=""
          className={classes.imgPointer}
          src={getImage(row.value)}
          onClick={() => {
            setDetailView({ id: row.original.id, isGood: true });
          }}
          onContextMenu={() => addCacheId(row.original.id)}
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
    },
  ];
  return (
    <React.Fragment>
      <Card classes={{ root: classes.card }}>
        <CardHeader
          avatar={
            <Avatar
              className={classes.avatar}
              src={getImage(img)}
              onClick={() => handleCopy(name)}
            />
          }
          title={
            <span className={classes.title} onClick={() => handleExport(name)}>
              <Typography variant="body1" component="span">
                {name}
              </Typography>
              {stageDesc && (
                <Typography
                  variant="body1"
                  color="secondary"
                  component="span"
                >{`[${stageDesc}]`}</Typography>
              )}
            </span>
          }
          subheader="单位"
        />
      </Card>
      {drop && (
        <>
          <CardHeader title="掉落物品" />
          <CardContent>
            <ReactTable {...tableConfig} pageSize={drop.length} columns={columns} data={drop} />
          </CardContent>
        </>
      )}
    </React.Fragment>
  );
};

export default BossDropView;
