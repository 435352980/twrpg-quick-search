import React from 'react';

import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Tooltip, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import arrayMove from 'array-move';

import { getDb, getImage } from '@/db';
import { useStoreActions, useStoreState } from '@/store';
import { getAnchor } from '@/utils/common';

interface DragGoodProps {
  id: string;
  index: number;
}

const useStyles = makeStyles({
  dropContent: {
    flex: 1,
    display: 'flex',
    width: '80%',
    overflow: 'auto',
    height: 64,
    marginTop: 16,
  },
  dragImg: { width: 48, height: 48, cursor: 'pointer' },
  tip: {
    fontWeight: 400,
    backgroundImage: 'linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)',
    color: '#000',
    fontSize: '1.2rem',
  },
});

const DragGood: React.FC<DragGoodProps> = ({ id, index }) => {
  const classes = useStyles();
  const { name, img } = getDb('goods').find('id', id);
  const removeCacheId = useStoreActions(actions => actions.good.removeCacheId);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Tooltip title={name} placement="top" classes={{ tooltip: classes.tip }}>
            <img
              // data-tip={name}
              alt={name}
              src={getImage(img)}
              className={classes.dragImg}
              onContextMenu={() => removeCacheId(id)}
              onClick={e => setDetailView({ id, show: true, isGood: true, anchor: getAnchor(e) })}
            />
          </Tooltip>
        </div>
      )}
    </Draggable>
  );
};

const DragGoodList = ({ ids }: { ids: string[] }) => (
  <>
    {ids.map((id, index) => (
      <DragGood key={id} id={id} index={index} />
    ))}
  </>
);

const MemoDragGoodList = React.memo(DragGoodList);

const CachePanel = ({ disableRight = false }) => {
  const classes = useStyles();
  const cacheIds = useStoreState(state => state.good.cacheIds);
  const setCacheIds = useStoreActions(actions => actions.good.setCacheIds);
  const setShowCache = useStoreActions(actions => actions.good.setShowCache);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    setCacheIds(arrayMove(cacheIds, result.source.index, result.destination.index));
  };

  return (
    <Grid container direction="row">
      <Button color="secondary" onClick={() => setCacheIds([])}>
        清除缓存
      </Button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cachePanelDroppable" direction="horizontal">
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classes.dropContent}
            >
              <MemoDragGoodList ids={cacheIds} />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button color="primary" disabled={disableRight} onClick={() => setShowCache(true)}>
        查看缓存
      </Button>
    </Grid>
  );
};

export default CachePanel;
