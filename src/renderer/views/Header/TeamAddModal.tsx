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

const TeamAddModal: React.FC<TeamAddModalProps> = ({ open, handleClose, handleSubmit }) => {
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
      <DialogTitle>{local.views.header.team.add}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          error={!name}
          label={local.views.header.team.name}
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

export default TeamAddModal;
