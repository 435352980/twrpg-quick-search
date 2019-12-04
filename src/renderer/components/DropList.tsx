import React, { HTMLProps } from 'react';

import { Droppable, Draggable, DroppableProvided } from 'react-beautiful-dnd';
import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { getImage } from '@/db';

interface DragListItem {
  id: string;
  name: string;
  img: string;
}

interface DropListProps {
  list: DragListItem[];
  size?: 'large' | 'small';
  droppableId: string;
  onItemClick: (id: string, e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
  onItemContextMenu: (id: string, index: number) => void;
  dragContentProps?: HTMLProps<HTMLDivElement>;
}

interface DragGoodListProps {
  list: DragListItem[];
  size: 'large' | 'small';
  droppableId: string;
  provided: DroppableProvided;
  onItemClick: (id: string, e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
  onItemContextMenu: (id: string, index: number) => void;
}

interface StyleProps {
  size: 'large' | 'small';
}

const useStyles = makeStyles({
  dropContent: {
    overflowX: 'auto',
    userSelect: 'none',
    height: 64,
    // marginBottom: 16,
  },
  dropContentSmall: {
    overflowX: 'auto',
    userSelect: 'none',
    height: 48,
    // marginBottom: 16,
  },
  dragContent: {
    // WebkitBoxAlign: 'start',
    // alignItems: 'start',
    minWidth: 600,
    // WebkitBoxFlex: 1,
    // flexGrow: 1,
    display: 'inline-flex',
  },
  dragImg: {
    width: 48,
    height: 48,
    cursor: 'pointer',
  },
  dragImgSmall: {
    width: 32,
    height: 32,
    cursor: 'pointer',
  },
  tip: {
    fontWeight: 400,
    backgroundImage: 'linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)',
    color: '#000',
    fontSize: '1.2rem',
  },
});

// const DragGoodList: React.FC<DragGoodListProps> = ({
//   list,
//   size,
//   droppableId,
//   provided,
//   onItemClick,
//   onItemContextMenu,
// }) => {
//   const classes = useStyles({ size });

//   return (

//   );
// };

// const MemoDragGoodList = React.memo(DragGoodList);

const DropList: React.FC<DropListProps> = ({
  list,
  size = 'large',
  droppableId,
  onItemClick,
  onItemContextMenu,
  dragContentProps,
}) => {
  const classes = useStyles();

  return (
    <Droppable droppableId={droppableId} direction="horizontal">
      {provided => (
        <div
          className={size === 'small' ? classes.dropContentSmall : classes.dropContent}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className={classes.dragContent} {...dragContentProps}>
            {list.map((item, index) => (
              <Draggable
                key={`${droppableId}${index}|${item.id}`}
                draggableId={`${droppableId}${index}|${item.id}`}
                index={index}
              >
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Tooltip title={item.name} placement="top" classes={{ tooltip: classes.tip }}>
                      <img
                        onClick={e => onItemClick(item.id, e)}
                        onContextMenu={() => onItemContextMenu(item.id, index)}
                        alt={item.name}
                        src={getImage(item.img)}
                        className={size === 'small' ? classes.dragImgSmall : classes.dragImg}
                      />
                    </Tooltip>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
          {/* {provided.placeholder} */}
        </div>
      )}
    </Droppable>
  );
};

export default DropList;
