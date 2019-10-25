import React, { useState, FC } from 'react';
import { makeStyles } from '@material-ui/core';
import { Typography, Tooltip } from '@material-ui/core';
import { diffRequireInfo } from './requireUtil';
import { getDb, getImage } from '@/db';

// const getId = name => getDb('goods').find('name', name).id;
// const getName = id => getDb('goods').find('id', id).name;

const useStyles = makeStyles(theme => ({
  root: { display: 'flex', flexDirection: 'column' },
  tip: {
    fontWeight: 400,
    backgroundImage: 'linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)',
    color: '#000',
    fontSize: '1.2rem',
  },
  tooltipPopper: {
    opacity: 1,
  },
  targetImgsWrapper: {
    marginTop: 16,
    marginRight: 16,
    marginLeft: 16,
    textAlign: 'center',
    // maxWidth: 625
  },
  img: {
    width: 64,
    marginRight: 8,
  },
  headerImg: {
    width: 32,
    cursor: 'pointer',
    userSelect: 'none',
    // marginRight: 8
  },
  btnsWrapper: {
    display: 'flex',
    color: 'white',
    // boxShadow: theme.shadows['4']
    backgroundColor: theme.palette.primary.main,
  },
  btn: { margin: 8 },
  itemWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 16,
    marginRight: 16,
    marginLeft: 16,
    // boxShadow: theme.shadows['4'],
    // backgroundColor: theme.palette.primary['400'],
    backgroundColor: '#93d7ffba',
    // justifyContent: 'center',
    // margin: 8
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: 8,
  },
  dropDesc: { flex: 1, overflowY: 'auto' },
  noSelect: { userSelect: 'none' },
}));

interface CalcItemsProps {
  /**
   * 目标物品ID列表
   */
  targetIds: string[];
  /**
   * 拥有物品ID列表
   */
  haveIds: string[];
}

const CalcItems: FC<CalcItemsProps> = ({ targetIds = [], haveIds = [] }) => {
  const classes = useStyles();
  const [selectItem, setSelectItem] = useState<string | null>();
  const { sum, sumCount, choose, chooseCount } = selectItem
    ? diffRequireInfo([selectItem], haveIds)
    : diffRequireInfo(targetIds, haveIds);

  // console.log(sortedSumKeys.map(id => getDb('goods').find('id', id).name));
  return (
    <div className={classes.root}>
      <div className={classes.targetImgsWrapper}>
        {targetIds.map((id, index) => {
          const { name, img } = getDb('goods').find('id', id);
          return (
            <Tooltip
              key={`${id}-${index}`}
              classes={{
                tooltip: classes.tip,
              }}
              placement="top"
              title={name}
            >
              <img
                alt={name}
                className={classes.headerImg}
                src={getImage(img)}
                onClick={() => setSelectItem(id)}
                onContextMenu={() => setSelectItem(null)}
              />
            </Tooltip>
          );
        })}
      </div>
      <Typography variant="body1" align="center" className={classes.noSelect}>
        {`总计:${sum.length - choose.length / 2}`}
      </Typography>
      {Object.keys(sumCount).map(id => {
        const { name, img, buildFrom, dropFrom, stageDesc } = getDb('goods').find('id', id);
        // console.log(getDb('goods').find('id', id));
        return (
          <div key={id} className={classes.itemWrapper}>
            <img alt={name} className={classes.img} src={getImage(img)} />
            <div className={classes.item}>
              <Typography variant="body1">{name}</Typography>
              {stageDesc && <Typography variant="body1">{`[${stageDesc}]`}</Typography>}
              <Typography variant="body1">
                数量:
                {sumCount[id]}
                {chooseCount[id] ? `(?-${chooseCount[id]})` : ''}
              </Typography>
            </div>
            <div className={classes.dropDesc}>
              {buildFrom &&
                buildFrom.map((info, i) => {
                  const { name, img, num, dropFrom } = info;
                  return (
                    <div
                      key={`dropDesc-${i}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        ...(name.includes('战斗残骸') ? { justifyContent: 'center' } : null),
                        // border: '1px solid #000',
                      }}
                    >
                      <img
                        alt={name}
                        style={{ width: 32, height: 32, marginRight: 4 }}
                        src={getImage(img)}
                      />
                      <Typography variant="body1" align="center">
                        {name}
                        {num !== 1 && `x${num}`}
                      </Typography>
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          {dropFrom &&
                            dropFrom.map((info, i) => (
                              <Typography key={`${info.id}-${i}`} variant="body1" align="center">
                                {`【${info.name}】【${info.desc}】`}
                              </Typography>
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              {dropFrom &&
                dropFrom.map((dp, i) => (
                  <Typography key={`dropDesc-${i}`} variant="body1" align="center">
                    {`${dp.name}【${dp.desc}】`}
                  </Typography>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalcItems;
