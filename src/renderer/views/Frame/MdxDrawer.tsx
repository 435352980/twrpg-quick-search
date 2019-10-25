import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Drawer } from '@material-ui/core';
import MdxViewer from '@/components/MdxViewer';
import { useStoreActions } from '@/store';

interface MdxDrawerProps {
  /**
   * 模型名称
   */
  name: string;
  /**
   * 挂载位置
   */
  anchor: 'left' | 'right';
  /**
   * 是否显示
   */
  show: boolean;
}
const useStyles = makeStyles({
  drawerPaper: {
    width: 'max-content',
  },
});

const MdxDrawer: React.FC<MdxDrawerProps> = ({ name, anchor, show }) => {
  const classes = useStyles();
  const setMdxView = useStoreActions(actions => actions.view.setMdxView);

  return (
    <Drawer
      classes={{ paper: classes.drawerPaper }}
      anchor={anchor as 'left' | 'right'}
      open={show}
      // ModalProps={{ BackdropProps: { invisible: true }}}
      onClose={() => setMdxView({ show: false })}
    >
      <MdxViewer name={name} />
    </Drawer>
  );
};

export default MdxDrawer;
