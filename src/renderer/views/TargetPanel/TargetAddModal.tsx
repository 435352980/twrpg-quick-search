import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';

interface TeamAddModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (name: string) => void;
  local: Local;
}

const TargetAddModal: React.FC<TeamAddModalProps> = ({
  open,
  handleClose,
  handleSubmit,
  local,
}) => {
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
      <DialogTitle>{local.views.targetPanel.addTarget}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          error={!name}
          label={local.views.targetPanel.targetName}
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
          {local.common.cancel}
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
          {local.common.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TargetAddModal;
