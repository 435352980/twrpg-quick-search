import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';
import HeroSelect from '@renderer/components/HeroSelect';

interface AddPlayerFormProps {
  show: boolean;
  handleClose: () => void;
  handleSubmit: (name: string, heroId: string) => void;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ show, handleClose, handleSubmit }) => {
  const [name, setName] = useState('');
  const [heroId, setHeroId] = useState('');
  return (
    <Dialog
      PaperProps={{ style: { overflow: 'visible' } }}
      open={show}
      fullWidth
      BackdropProps={{ invisible: true }}
      onBackdropClick={handleClose}
      onEscapeKeyDown={handleClose}
    >
      <DialogTitle>添加</DialogTitle>
      <DialogContent>
        <HeroSelect placeholder="选择玩家" onChange={([id]) => id && setHeroId(id)} />
        <TextField
          error={!name}
          label="玩家名称"
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={e => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
            setName('');
            setHeroId('');
          }}
          color="primary"
        >
          取消
        </Button>
        <Button
          onClick={() => {
            if (name && heroId) {
              handleSubmit(name, heroId);
              setName('');
              setHeroId('');
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

export default AddPlayerForm;
