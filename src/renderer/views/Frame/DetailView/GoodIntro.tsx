import React from 'react';
import { makeStyles, Tooltip } from '@material-ui/core';
import { Card, CardHeader, CardContent, Typography, Avatar } from '@material-ui/core';

import { getDb, getImage } from '@/db';
import { useStoreActions } from '@/store';

const useStyles = makeStyles({
  card: {
    overflow: 'visible',
    boxShadow: 'none',
    width: 650,
  },
  title: { cursor: 'pointer' },
  avatar: {
    cursor: 'pointer',
  },
  tip: {
    fontWeight: 400,
    backgroundImage: 'linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)',
    color: '#000',
    fontSize: '1.2rem',
  },
  heroLimitImg: { width: 40, height: 40 },
});

// const goodDB = getDb('goods')

const GoodIntro = ({ id, handleCopy, handleExport }: any) => {
  const classes = useStyles();
  const addCacheId = useStoreActions(actions => actions.good.addCacheId);
  if (!id) {
    return <div />;
  }
  const {
    name,
    img,
    level,
    limit,
    qualityString,
    desc,
    goodTypeString,
    stageDesc,
    effect,
    exclusive,
  } = getDb('goods').find('id', id);

  return (
    <Card classes={{ root: classes.card }}>
      <CardHeader
        avatar={
          <Avatar
            className={classes.avatar}
            src={getImage(img)}
            onClick={() => handleCopy(name)}
            onContextMenu={() => addCacheId(id)}
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
        subheader={`${level || ''} ${qualityString ? `[${qualityString}]` : ''}${
          goodTypeString ? `[${goodTypeString}]` : ''
        }`}
      />
      <CardContent>
        {limit && (
          <>
            <Typography variant="subtitle1" color="secondary">
              佩戴限定
            </Typography>
            {limit.map(({ id, name, img }, index) => {
              return (
                <Tooltip
                  title={name}
                  key={index}
                  classes={{ tooltip: classes.tip }}
                  placement="top"
                >
                  <img className={classes.heroLimitImg} alt={name} src={getImage(img)} />
                </Tooltip>
              );
            })}
          </>
        )}
        {`${desc}\n${effect || ''}`.split(/\r\n|\n/).map((info, i) => (
          <Typography variant="subtitle1" key={i}>
            {info}
          </Typography>
        ))}
      </CardContent>

      {exclusive && (
        <React.Fragment>
          <CardHeader title="专属" />
          <CardContent>
            {exclusive.map((exHeroInfo, index) => {
              return (
                <React.Fragment key={index}>
                  <Typography variant="subtitle1">{exHeroInfo.name}</Typography>
                  <Typography variant="subtitle1">{exHeroInfo.on}</Typography>
                  {exHeroInfo.desc.split('\r\n').map((str, i) => (
                    <Typography variant="subtitle1" key={`efinfo${i}`}>
                      {str}
                    </Typography>
                  ))}
                </React.Fragment>
              );
            })}
          </CardContent>
        </React.Fragment>
      )}
    </Card>
  );
};

export default GoodIntro;
