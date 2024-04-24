import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import HeroSelect from '@renderer/components/HeroSelect';

interface AddPlayerFormProps {
  show: boolean;
  handleClose: () => void;
  handleSubmit: (name: string, heroId: string) => void;
  local: Local;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({
  show,
  handleClose,
  handleSubmit,
  local,
}) => {
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
      <DialogTitle>{local.views.team.add}</DialogTitle>
      <DialogContent>
        <HeroSelect
          placeholder={local.views.team.chooseHero}
          onChange={([id]) => id && setHeroId(id)}
        />
        <TextField
          error={!name}
          label={local.views.team.mamberName}
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
          {local.common.cancel}
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
          {local.common.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPlayerForm;
