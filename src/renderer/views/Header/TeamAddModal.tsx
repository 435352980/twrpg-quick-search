import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';

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
      <DialogTitle>添加分组</DialogTitle>
      <DialogContent>
        <TextField
          error={!name}
          label="分组名称"
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
          取消
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
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamAddModal;
