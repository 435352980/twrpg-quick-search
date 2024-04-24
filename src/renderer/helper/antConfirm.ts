import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/es/modal/Modal';

const antConfirm = (config: ModalFuncProps, local: Local) => {
  return Modal.confirm({
    maskClosable: true,
    mask: false,
    okText: local.common.ok,
    cancelText: local.common.cancel,
    onOk: config.onOk,
    title: config.title,
    content: config.content,
  });
};

export default antConfirm;
