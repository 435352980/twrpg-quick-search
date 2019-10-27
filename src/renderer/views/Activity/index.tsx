import React, { useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Typography, Paper } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Column, Table } from 'react-virtualized';
import { makeStyles } from '@material-ui/core';
import { message } from 'antd';
import Footer from '../Footer';
import activityConfig from './activityConfig';
import { useStoreActions } from '@/store';
import { getImage, getDb } from '@/db';
import ColorBtn from '@/components/ColorBtn';
import useWindowSize from '@/hooks/useWindowSize';
import { getAnchor } from '@/utils/common';
import Cell from '@/components/Cell';
import { tableStyle } from '@/theme/common';

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
  quickBtnRoot: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    background: grey['100'],
    // marginTop: theme.spacing.unit * 2,
    // marginBottom: 16,
    // padding: 8
    // marginTop: 64,
  },
  quickBtn: { margin: 4, flex: 1, boxShadow: 'none' },
  img: { width: 48, height: 48 },
  pointer: { cursor: 'pointer' },
  imageCell: { cursor: 'pointer', '& img': { width: 48, height: 48 } },
});

const Activity: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();
  const setMdxView = useStoreActions(actions => actions.view.setMdxView);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const { innerWidth, innerHeight } = useWindowSize();
  const [activityType, setActivityType] = useState<'newYear' | 'summer' | 'april' | 'halloween'>(
    'summer',
  );
  const source = activityConfig[activityType];
  return (
    <div>
      <Paper elevation={0} className={classes.quickBtnRoot}>
        <ColorBtn
          variant="contained"
          color={activityType === 'newYear' ? 'red' : 'blue'}
          className={classes.quickBtn}
          onClick={() => activityType !== 'newYear' && setActivityType('newYear')}
        >
          新年活动
        </ColorBtn>

        <ColorBtn
          variant="contained"
          color={activityType === 'april' ? 'red' : 'blue'}
          className={classes.quickBtn}
          onClick={() => activityType !== 'april' && setActivityType('april')}
        >
          愚人节活动
        </ColorBtn>

        <ColorBtn
          variant="contained"
          color={activityType === 'summer' ? 'red' : 'blue'}
          className={classes.quickBtn}
          onClick={() => activityType !== 'summer' && setActivityType('summer')}
        >
          夏日活动
        </ColorBtn>

        <ColorBtn
          variant="contained"
          color={activityType === 'halloween' ? 'red' : 'blue'}
          className={classes.quickBtn}
          onClick={() => activityType !== 'halloween' && setActivityType('halloween')}
        >
          万圣节活动
        </ColorBtn>
      </Paper>
      <Table
        className={classes.table}
        headerClassName={classes.header}
        width={innerWidth}
        height={innerHeight - 180}
        headerHeight={40}
        rowStyle={{ alignItems: 'stretch' }}
        rowHeight={64}
        rowCount={source.length}
        rowGetter={({ index }) => source[index]}
      >
        <Column
          label="序号"
          dataKey="no"
          width={96}
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
          cellRenderer={({ rowIndex }) => {
            const good = getDb('goods').find('id', source[rowIndex].id);
            const { name, img } = good;
            return (
              <Cell
                className={classes.imageCell}
                onClick={e =>
                  setDetailView({
                    isGood: true,
                    id: good.id,
                    show: true,
                    anchor: getAnchor(e),
                  })
                }
              >
                <img className={classes.img} alt={name} src={getImage(img)} />
              </Cell>
            );
          }}
        />
        <Column
          label="名称"
          dataKey="name"
          width={360}
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
          label="皮肤"
          dataKey="skin"
          width={300}
          flexGrow={1}
          cellRenderer={({ rowIndex }) => {
            const heroRef = source[rowIndex].heroRef;
            return (
              <Cell>
                {heroRef &&
                  heroRef.map((heroId, index) => {
                    const hero = getDb('heroes').find('id', heroId);
                    const { skins } = hero;
                    return (
                      <img
                        alt=""
                        className={`${classes.img} ${classes.pointer}`}
                        key={heroId + index}
                        src={getImage(hero.img)}
                        onClick={e => {
                          if (skins && skins[activityType]) {
                            const skinInfo = skins[activityType].find(
                              info => info.id === source[rowIndex].id,
                            );
                            if (skinInfo) {
                              setMdxView({
                                name: skinInfo.model,
                                anchor: getAnchor(e),
                                show: true,
                              });
                            } else {
                              message.info('暂无模型(和谐)');
                            }
                          }
                        }}
                      />
                    );
                  })}
              </Cell>
            );
          }}
        />
      </Table>
      <Footer />
    </div>
  );
};

export default Activity;
