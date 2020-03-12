import React, { FC } from 'react';
import { Unit, ObjDisplayInfo } from '@renderer/dataHelper/types';
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
import styled from '@emotion/styled';
import IconImage from '@renderer/components/IconImage';
import CyanTooltip from '@renderer/components/CyanTooltip';

//解决图片生成时文字断行问题
const Typography = styled(MuiTypography)`
  white-space: nowrap;
  text-overflow: ellipsis;
` as React.ComponentType<TypographyProps & { component?: React.ElementType }>;

const TableCell = styled(MuiTableCell)`
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const BossDropPanel: FC<{
  data: Unit;
  handleImgClick: (info: ObjDisplayInfo) => void;
  handleImgContextMenu: (info: ObjDisplayInfo) => void;
  local: Local;
}> = ({ data, handleImgClick, handleImgContextMenu, local }) => {
  const { drops } = data;

  return (
    <>
      {drops && (
        <>
          <CardHeader title={local.views.good.bossDrop}></CardHeader>
          <Paper>
            <TableContainer style={{ minHeight: '100%', minWidth: '100%', overflow: 'hidden' }}>
              <Table size="small">
                <TableBody>
                  {drops.map(drop => {
                    const { id, name, imgData, desc, agentDrops } = drop;
                    return (
                      <TableRow key={id} hover>
                        <TableCell align="left">
                          <IconImage
                            float="left"
                            size={36}
                            src={imgData}
                            pointer
                            onClick={() => handleImgClick(drop)}
                            onContextMenu={() => handleImgContextMenu(drop)}
                          />
                        </TableCell>
                        <TableCell align="left">
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1">
                              {agentDrops && (
                                <Typography variant="body1" color="primary" component="span">
                                  {desc}
                                </Typography>
                              )}
                              {name}
                            </Typography>
                            {agentDrops && (
                              <>
                                {'　=>　'}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  {agentDrops.map(agentDrop => {
                                    const { id, name, imgData, desc } = agentDrop;
                                    return (
                                      <div key={'agentDrop-' + id} style={{ display: 'flex' }}>
                                        <CyanTooltip title={name} placement="top">
                                          <IconImage
                                            float="left"
                                            size={24}
                                            src={imgData}
                                            pointer
                                            onClick={() => handleImgClick(agentDrop)}
                                            onContextMenu={() => handleImgContextMenu(agentDrop)}
                                          />
                                        </CyanTooltip>

                                        <Typography variant="body1" component="span">
                                          {'　=>　'}
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          component="span"
                                          color="primary"
                                        >
                                          {desc}
                                        </Typography>
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell align="left">
                          {!agentDrops && (
                            <Typography variant="body1" color="primary">
                              {desc}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </>
  );
};

export default BossDropPanel;
