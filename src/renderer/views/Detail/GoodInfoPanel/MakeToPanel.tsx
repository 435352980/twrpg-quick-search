import React, { FC } from 'react';
import {
  Typography as MuiTypography,
  TableContainer,
  Table,
  TableRow,
  TableCell as MuiTableCell,
  TableBody,
  Paper,
  TypographyProps,
  CardHeader,
} from '@material-ui/core';
import { MakeTo, ObjDisplayInfo } from '@renderer/dataHelper/types';
import IconImage from '@renderer/components/IconImage';
import styled from '@emotion/styled';

//解决图片生成时文字断行问题
const Typography = styled(MuiTypography)`
  white-space: nowrap;
  text-overflow: ellipsis;
` as React.ComponentType<TypographyProps & { component?: React.ElementType }>;

const TableCell = styled(MuiTableCell)`
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const MakeToPanel: FC<{
  makeTos: MakeTo[];
  handleImgClick: (info: ObjDisplayInfo) => void;
  handleImgContextMenu: (info: ObjDisplayInfo) => void;
  local: Local;
}> = ({ makeTos, handleImgClick, handleImgContextMenu, local }) => {
  return (
    <div>
      <CardHeader title={local.views.good.makeTo}></CardHeader>
      <Paper>
        <TableContainer style={{ minHeight: '100%', minWidth: '100%', overflow: 'hidden' }}>
          <Table size="small">
            <TableBody>
              {makeTos.map(makeTo => {
                const { id, name, imgData } = makeTo;
                return (
                  <TableRow key={id} hover>
                    <TableCell align="left">
                      <IconImage
                        float="left"
                        size={36}
                        src={imgData}
                        pointer
                        onClick={() => handleImgClick(makeTo)}
                        onContextMenu={() => handleImgContextMenu(makeTo)}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body1">{name}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default MakeToPanel;
