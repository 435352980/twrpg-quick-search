import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';
import local from '@renderer/local';

interface TeamAddModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (name: string) => void;
}

const TargetAddModal: React.FC<TeamAddModalProps> = ({ open, handleClose, handleSubmit }) => {
  const [name, setName] = useState<string>('');
  return (
    <Dialog
      scroll="body"
      open={open}
      fullWidth
      BackdropProps={{ invisible: true }}
      // closeAfterTransition
      onBackdropClick={() => handleClose()}
      onEscapeKeyDown={() => handleClose()}
    >
      <DialogTitle>{local.TARGET_PANEL.ADD_TARGET}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          error={!name}
          label={local.TARGET_PANEL.TARGET_NAME}
          fullWidth
          margin="normal"
          variant="outlined"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
            setName('');
          }}
          color="primary"
        >
          {local.COMMON.CANCEL}
        </Button>
        <Button
          onClick={() => {
            if (name) {
              handleSubmit(name);
              handleClose();
              setName('');
            }
          }}
          color="primary"
        >
          {local.COMMON.OK}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TargetAddModal;
