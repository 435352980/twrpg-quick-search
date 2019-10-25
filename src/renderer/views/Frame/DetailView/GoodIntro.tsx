import React from 'react';
import { makeStyles } from '@material-ui/core';
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
