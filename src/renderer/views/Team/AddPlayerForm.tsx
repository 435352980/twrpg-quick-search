import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import Select from 'react-select';
import { getDb, getImage } from '@/db';

const useStyles = makeStyles({
  addDialogRoot: { overflow: 'visible' },
  addDialogContentRoot: { overflow: 'visible' },
  selectOptionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    color: '#000',
    alignItems: 'center',
    float: 'left',
  },
  selectOptionDesc: {
    width: 64,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  },
});

interface AddPlayerFormProps {
  show: boolean;
  handleClose: () => void;
  handleSubmit: (name: string, heroId: string) => void;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ show, handleClose, handleSubmit }) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [heroId, setHeroId] = useState('');
  return (
    <Dialog
      classes={{ paper: classes.addDialogRoot }}
      open={show}
      // scroll="body"
      fullWidth
      BackdropProps={{ invisible: true }}
      onBackdropClick={handleClose}
      onEscapeKeyDown={handleClose}
    >
      <DialogTitle>添加</DialogTitle>
      <DialogContent classes={{ root: classes.addDialogContentRoot }}>
        <TextField
          error={!name}
          label="玩家名称"
          fullWidth
          margin="normal"
          variant="outlined"
          // value={editData.name ? editData.name : ''}
          onChange={e => setName(e.target.value)}
        />
        <Select
          placeholder=""
          isClearable
          menuPlacement="top"
          options={getDb('heroes')
            .getAll()
            .filter(unit => unit.name)}
          styles={{
            input: base => ({
              ...base,
              height: 64,
              width: 250,
            }),
            container: base => ({ ...base }),
            menu: base => ({ ...base }),
          }}
          getOptionLabel={(option: any): string =>
            ((
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={getImage(option.img)} />
                <Typography variant="h4" component="span">
                  {option.name}
                </Typography>
              </div>
            ) as unknown) as string
          }
          onChange={(option: any) => setHeroId(option ? option.id : null)}
          // value={{ value: editData.role, img: editData.img }}
          components={{
            Option: props => {
              const { data, innerProps } = props;
              const { ...rest } = innerProps;
              return (
                <div {...rest} className={classes.selectOptionWrapper}>
                  <img src={getImage(data.img)} />
                  <div className={classes.selectOptionDesc}>{data.name}</div>
                </div>
              );
            },
          }}
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
