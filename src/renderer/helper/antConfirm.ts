import confirm from 'antd/es/modal/confirm';
import { ModalFuncProps } from 'antd/es/modal/Modal';

const antConfirm = (config: ModalFuncProps, local: Local) => {
  return confirm({
    maskClosable: true,
    mask: false,
    okText: local.common.ok,
    cancelText: local.common.cancel,
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
