import React from 'react';
import { Drawer } from '@material-ui/core';
import { useStoreActions, useStoreState } from '@renderer/store';
import MdxViewer from './MdxViewer';

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

const MdxDrawer: React.FC<MdxDrawerProps> = ({ name, anchor, show }) => {
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const setMdxView = useStoreActions(actions => actions.view.setMdxView);

  return (
    <Drawer
      PaperProps={{ style: { width: 'max-content' } }}
      anchor={anchor as 'left' | 'right'}
      open={show}
      // ModalProps={{ BackdropProps: { invisible: true }}}
      // ModalProps={{ keepMounted: true }}
      onClose={() => setMdxView({ show: false })}
    >
      <MdxViewer name={name} attaches={dataHelper.getAttachs()} />
    </Drawer>
  );
};

export default MdxDrawer;
