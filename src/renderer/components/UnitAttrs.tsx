import React, { FC } from 'react';
import { W3uUnit } from '@renderer/dataHelper/types';
import local from '@renderer/local';
import {
  Typography as MuiTypography,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell as MuiTableCell,
  TypographyProps,
} from '@material-ui/core';
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

const UnitAttrs: FC<{ data: W3uUnit }> = ({ data }) => {
  return (
    <Paper>
      <TableContainer style={{ minHeight: '100%', minWidth: '100%', overflow: 'hidden' }}>
        <Table size="small">
          <TableBody>
            {Object.entries(local.common.unitProps).reduce((acc, [key, name]) => {
              const value = data[key];
              if (value) {
                //预验证取整之后是否为空值
                if (typeof value === 'number' && parseInt(value.toFixed(1)) !== 0) {
                  acc.push(
                    <TableRow key={key} hover>
                      <TableCell align="left">
                        <Typography variant="body1">{name}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="body1" color="primary">
                          {typeof value === 'number' ? value.toFixed(1).replace(/\.0$/, '') : value}
                        </Typography>
                      </TableCell>
                    </TableRow>,
                  );
                }
              }
              return acc;
            }, [])}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UnitAttrs;
