import React from 'react';
import { makeStyles } from '@material-ui/core';
import { getImage } from '@/db';

const useStyles = makeStyles({
  img: { width: 40, height: 40 },
  imgPointer: { width: 40, height: 40, cursor: 'pointer' },
});

interface ImageCellProps {
  id: string;
  name: string;
  img: string;
  onClick?: (id: string) => void;
  onContextMenu?: (id: string) => void;
}

const ImageCell: React.FC<ImageCellProps> = ({ id, name, img, onClick, onContextMenu }) => {
  const classes = useStyles();
  return (
    <img
      className={classes.imgPointer}
      alt={name}
      src={getImage(img)}
      onClick={() => {
        if (onClick) {
          onClick(id);
        }
      }}
      onContextMenu={() => {
        if (onContextMenu) {
          onContextMenu(id);
        }
      }}
    />
  );
};

export default ImageCell;
