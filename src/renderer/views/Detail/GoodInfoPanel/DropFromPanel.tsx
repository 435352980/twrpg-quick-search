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
import { Good, ObjDisplayInfo } from '@renderer/dataHelper/types';
import CyanTooltip from '@renderer/components/CyanTooltip';
import IconImage from '@renderer/components/IconImage';

import styled from '@emotion/styled';
import local from '@renderer/local';

const DropDescCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

//解决图片生成时文字断行问题
const Typography = styled(MuiTypography)`
  white-space: nowrap;
  text-overflow: ellipsis;
` as React.ComponentType<TypographyProps & { component?: React.ElementType }>;

const TableCell = styled(MuiTableCell)`
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const DropFromPanel: FC<{
  data: Good;
  handleImgClick: (info: ObjDisplayInfo) => void;
  handleImgContextMenu: (info: ObjDisplayInfo) => void;
}> = ({ data, handleImgClick, handleImgContextMenu }) => {
  const { dropFroms } = data;
  return (
    <div>
      <CardHeader title={local.views.good.dropFrom}></CardHeader>
      <Paper>
        <TableContainer style={{ minHeight: '100%', minWidth: '100%', overflow: 'hidden' }}>
          <Table size="small">
            <TableBody>
              {dropFroms.map(dropFrom => {
                const { id, name, imgData, agent, desc } = dropFrom;
                return (
                  <TableRow key={id} hover>
                    <TableCell align="left">
                      <IconImage
                        float="left"
                        size={36}
                        src={imgData}
                        pointer
                        onClick={() => handleImgClick(dropFrom)}
                        onContextMenu={() => handleImgContextMenu(dropFrom)}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <DropDescCell>
                        <Typography variant="body1">{name}</Typography>
                        {agent && (
                          <>
                            {'　=>　'}
                            <Typography variant="body1" color="primary" component="span">
                              [{agent ? agent.desc : desc}]
                            </Typography>
                            {'　'}
                            <CyanTooltip title={agent.name} placement="top">
                              <IconImage
                                float="left"
                                size={24}
                                src={agent.imgData}
                                pointer
                                onClick={() => handleImgClick(agent)}
                                onContextMenu={() => handleImgContextMenu(agent)}
                              />
                            </CyanTooltip>
                            <Typography variant="body1" component="span">
                              {'　=>　'}
                            </Typography>
                          </>
                        )}
                      </DropDescCell>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body1" color="primary">
                        {desc}
                      </Typography>
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

export default DropFromPanel;
