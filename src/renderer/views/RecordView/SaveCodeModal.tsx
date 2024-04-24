import React from 'react';
import { Backdrop, Button, Dialog, DialogContent, Grid } from '@mui/material';
import { message } from '@renderer/helper';
import { clipboard } from 'electron';
import styled from '@emotion/styled';

interface SaveCodeModalProps {
  codes: string[];
  open: boolean;
  handleClose: () => void;
  local: Local;
}
const OperationBtn = styled(Button)`
  ${({ size }) =>
    size === 'small'
      ? `line-height: initial;
  padding: 0;
  min-height: 0;
  margin-bottom: 2px;`
      : ''}
`;

const SaveCodeModal: React.FC<SaveCodeModalProps> = ({ codes, open, handleClose, local }) => {
  return (
    <Dialog
      scroll="body"
      open={open}
      fullWidth
      // slotProps={{ backdrop: { invisible: true } }}
      hideBackdrop
      // closeAfterTransition
      onClose={() => handleClose()}
    >
      <DialogContent>
        <Grid container justifyContent="center" spacing={1}>
          {codes.map((code, index) => (
            <Grid item key={index}>
              <Button
                size={'medium'}
                variant="contained"
                color="primary"
                onClick={() => {
                  clipboard.writeText(code);
                  message.success(
                    local.views.record.getCopySuccessText(index, codes.length > 1 ? index + 1 : 0),
                  );
                }}
              >
                {local.views.record.copy}
                {codes.length > 1 ? index + 1 : ''}
              </Button>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default SaveCodeModal;
