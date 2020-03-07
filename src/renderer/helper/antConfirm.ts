import confirm from 'antd/es/modal/confirm';
import { ModalFuncProps } from 'antd/es/modal/Modal';
import local from '@renderer/local';

const antConfirm = (config: ModalFuncProps) => {
  return confirm({
    maskClosable: true,
    mask: false,
    okText: local.COMMON.OK,
    cancelText: local.COMMON.CANCEL,
    onOk: config.onOk,
    title: config.title,
    content: config.content,
    okButtonProps: {
      className: `MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textSecondary`,
    },
    cancelButtonProps: {
      className: `MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary`,
    },
  });
};

export default antConfirm;
