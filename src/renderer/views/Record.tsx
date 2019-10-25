import path from 'path';
import fs from 'fs';
import React, { useState, useEffect, useCallback } from 'react';
import { ipcRenderer, clipboard } from 'electron';
import { Button, Typography, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { Table, Column } from 'react-virtualized';
import { message, Modal } from 'antd';

import { RouteComponentProps } from '@reach/router';
// import { classNames } from 'react-select/src/utils';
import clsx from 'clsx';
import useWindowSize from '@/hooks/useWindowSize';
// import Footer from '../Footer';
import { getDb, getImage } from '@/db';

import { getAnchor } from '@/utils/common';
import { useStoreState, useStoreActions } from '@/store';

import Footer from '@/views/Footer';
import Cell from '@/components/Cell';
import { tableStyle } from '@/theme/common';

const useStyles = makeStyles({
  topBtnsWrapper: { display: 'flex', flexDirection: 'row', height: 32 },
  //table 基础样式
  table: tableStyle,
  //Table header基础样式
  header: {
    color: 'white',
    fontSize: '1rem',
    textAlign: 'center',
    userSelect: 'none',
  },
  //图片样式
  imgSmall: {
    width: 32,
    height: 32,
  },
  pointer: {
    cursor: 'pointer',
  },
  //功能按钮cell样式
  btnsCell: {
    display: 'flex',
    flexDirection: 'column',
  },
  changeColumn: {
    width: '100%',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    '& >p': {
      fontWeight: 700,
    },
  },
  codeCell: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    '& p': {
      flex: 'none!important',
    },
  },
  smallOperationBtn: {
    // color: '#fff',
    padding: 0,
    minHeight: 0,
    marginBottom: 1,
    boxShadow: 'unset',
    lineHeight: 'unset',
    // background: 'linear-gradient(132deg, #68ade2 0, #55b0ff 100%)',
    // boxShadow: '0 1px 2px 1px rgba(33, 203, 243, .3)',
  },
  text: {
    cursor: 'default',
  },
  tip: {
    fontWeight: 400,
    backgroundImage: 'linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)',
    color: '#000',
    fontSize: '1.2rem',
  },
});

const Record: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();
  const { innerWidth, innerHeight } = useWindowSize();
  const [records, setRecords] = useState<SaveRecord[]>([]);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const war3Path = useStoreState(state => state.app.war3Path);
  const selectedFile = useStoreState(state => state.common.selectedFile);
  const setSelectedFile = useStoreActions(actions => actions.common.setSelectedFile);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);

  const getRecords = useCallback(() => {
    selectedFile && ipcRenderer.send('getRecords', selectedFile);
  }, [selectedFile]);

  const onUpdateRecords = useCallback((event, records: SaveRecord[]) => {
    setRecords(records);
  }, []);

  useEffect(() => {
    ipcRenderer.on('updateRecords', onUpdateRecords);
    return () => {
      ipcRenderer.removeListener('updateRecords', onUpdateRecords);
    };
  }, [onUpdateRecords]);

  useEffect(() => {
    ipcRenderer.on('insertRecord', getRecords);
    getRecords();
    return () => {
      ipcRenderer.removeListener('insertRecord', getRecords);
    };
  }, [getRecords]);

  const buildItems = (list: string[]) => (
    <span>
      {list.map((name, i) => {
        const good = getDb('goods').find('name', name.replace(/ x[1-9][0-9]*/, ''));
        return (
          <Tooltip key={i} classes={{ tooltip: classes.tip }} placement="top" title={name}>
            {good ? (
              <img
                className={clsx(classes.imgSmall, classes.pointer)}
                alt={name}
                src={getImage(good.img)}
                onClick={e =>
                  setDetailView({
                    id: good.id,
                    show: true,
                    anchor: getAnchor(e),
                    isGood: true,
                  })
                }
              />
            ) : (
              <img className={classes.imgSmall} alt={name} src={getImage('BTNSpy')} />
            )}
          </Tooltip>
        );
      })}
    </span>
  );
  // console.log('render');
  if (!selectedFile) {
    // console.log(saveFile);
    return <div />;
  }

  return (
    <>
      <div className={classes.topBtnsWrapper}>
        <div style={{ flex: 1 }} />
        <Button
          color="secondary"
          onClick={() => {
            Modal.confirm({
              mask: false,
              title: '清除存档历史记录',
              content: '确认清除历史记录吗(仅保留最新一条记录)',
              okText: '确认',
              maskClosable: true,
              cancelText: '取消',
              okType: 'danger',
              onOk: () => {
                ipcRenderer.send('deleteRecords', selectedFile);
              },
            });
          }}
        >
          清除存档历史
        </Button>
        {war3Path &&
          selectedFile &&
          !fs.existsSync(path.join(war3Path, 'twrpg', `${selectedFile}.txt`)) && (
            <Button
              color="secondary"
              onClick={() => {
                Modal.confirm({
                  mask: false,
                  title: `删除存档记录【${selectedFile}】`,
                  content: '注:【只清除程序内部记录,不会影响存档文件】',
                  okText: '确认',
                  okType: 'danger',
                  maskClosable: true,
                  cancelText: '取消',
                  onOk: () => {
                    setSelectedFile('');
                    ipcRenderer.send('deleteFile', selectedFile);
                  },
                });
              }}
            >
              删除存档记录
            </Button>
          )}
      </div>
      <Table
        className={classes.table}
        headerClassName={classes.header}
        width={innerWidth}
        height={innerHeight - 168}
        headerHeight={40}
        rowStyle={{ alignItems: 'stretch' }}
        rowGetter={({ index }) => records[index]}
        rowCount={records.length}
        rowHeight={({ index }) => {
          if (records[index]) {
            return (records[index].bag || []).length > 29 ? 96 : 64;
          }
          return 64;
        }}
      >
        <Column
          label="行号"
          dataKey="no"
          width={90}
          cellRenderer={({ rowIndex }) => (
            <Cell>
              <Typography className={classes.text} variant="body1" align="center">
                {rowIndex + 1}
              </Typography>
            </Cell>
          )}
        />
        {isCodeMode ? (
          <Column
            label="存档代码"
            dataKey="codes"
            width={200}
            flexGrow={1}
            headerRenderer={() => (
              <Cell className={classes.changeColumn} onClick={() => setIsCodeMode(false)}>
                存档代码(点击切换历史装备)
              </Cell>
            )}
            cellRenderer={({ rowData }) => {
              const { codes = [] } = rowData as SaveRecord;
              return (
                <Cell className={classes.codeCell}>
                  {codes.map((code, index) => {
                    return (
                      <Typography key={index} className={classes.text} variant="body2">
                        {code}
                      </Typography>
                    );
                  })}
                </Cell>
              );
            }}
          />
        ) : (
          <Column
            label="存档代码"
            dataKey="codes"
            width={200}
            flexGrow={1}
            headerRenderer={() => (
              <Cell className={classes.changeColumn} onClick={() => setIsCodeMode(true)}>
                历史装备(点击切换存档代码)
              </Cell>
            )}
            cellRenderer={({ rowData }) => {
              const { panel, dust, bag, store } = rowData as SaveRecord;
              return (
                // <Cell {...props} className={classes.goodsImgCell}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ textAlign: 'left' }}>
                    {buildItems(panel || [])}
                    {buildItems(dust || [])}
                    {buildItems(store || [])}
                  </div>
                  <div style={{ textAlign: 'left' }}>{buildItems(bag || [])}</div>
                </div>
                // </Cell>
              );
            }}
          />
        )}

        <Column
          label="日期"
          dataKey="time"
          width={200}
          cellRenderer={({ cellData }) => (
            <Cell>
              <Typography className={classes.text} variant="subtitle1">
                {cellData}
              </Typography>
            </Cell>
          )}
        />
        <Column
          label="操作"
          dataKey="operations"
          width={90}
          cellRenderer={props => {
            const codes = records[props.rowIndex].codes;
            return (
              <Cell className={classes.btnsCell}>
                {codes.map((code, index) => {
                  return (
                    <Button
                      key={index}
                      variant="contained"
                      color="primary"
                      className={codes.length > 1 ? classes.smallOperationBtn : ''}
                      onClick={() => {
                        clipboard.writeText(codes[index]);
                        message.success(
                          `复制第${props.rowIndex + 1}条代码${
                            codes.length > 1 ? `【分段${index + 1}】` : ''
                          }成功!`,
                        );
                      }}
                    >
                      复制{codes.length > 1 ? index + 1 : ''}
                    </Button>
                  );
                })}
              </Cell>
            );
          }}
        />
        <Column
          label="操作"
          dataKey="otherOperation"
          width={90}
          cellRenderer={({ rowData }) => {
            const { id } = rowData as Good;
            return (
              <Cell>
                <Button
                  disabled={records && records.length === 1}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    ipcRenderer.send('deleteOneRecord', id);
                  }}
                >
                  删除
                </Button>
              </Cell>
            );
          }}
        />
      </Table>
      <Footer />
    </>
  );
};

export default Record;
