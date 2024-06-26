import React, { FC } from 'react';
import {
  Typography as MuiTypography,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell as MuiTableCell,
  TypographyProps,
  CardHeader,
  BadgeProps,
  Badge,
} from '@mui/material';
import { Good, DropFrom, ObjDisplayInfo } from '@renderer/dataHelper/types';
import IconImage from '@renderer/components/IconImage';
import DBHelper from '@renderer/dataHelper/dbHelper';
import CyanTooltip from '@renderer/components/CyanTooltip';
import styled from '@emotion/styled';
import { padding } from '@mui/system';

const BuildDescCell = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
`;

const MultiDropWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: '50%',
    top: '-4px',
    border: `2px solid ${(theme as any).palette.background.paper}`,
  },
}));

// 解决图片生成时文字断行问题
const Typography = styled(MuiTypography)`
  white-space: nowrap;
  text-overflow: ellipsis;
` as React.ComponentType<TypographyProps & { component?: React.ElementType }>;

const TableCell = styled(MuiTableCell)`
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ItemDropFrom: FC<{
  buildRef?: { data: Good; num: number };
  dropFroms: DropFrom[];
  handleImgClick: (info: ObjDisplayInfo) => void;
  handleImgContextMenu: (info: ObjDisplayInfo) => void;
}> = ({ buildRef, dropFroms, handleImgClick, handleImgContextMenu }) => {
  return (
    <>
      {buildRef && !dropFroms && (
        <BuildDescCell>
          <CyanTooltip title={buildRef.data.name} placement="top">
            <IconImage
              float="left"
              size={36}
              src={buildRef.data.imgData}
              pointer
              onClick={() => handleImgClick(buildRef.data)}
              onContextMenu={() => handleImgContextMenu(buildRef.data)}
            />
          </CyanTooltip>
          {'　'}
          <Typography variant="subtitle1">{buildRef.num && ` x${buildRef.num}`}</Typography>
        </BuildDescCell>
      )}
      {dropFroms &&
        dropFroms.map((dropFrom, index) => {
          const { name, imgData, desc, agent } = dropFrom;
          return (
            <BuildDescCell key={index}>
              {buildRef && (
                <>
                  <CyanTooltip title={buildRef.data.name} placement="top">
                    <IconImage
                      float="left"
                      size={36}
                      src={buildRef.data.imgData}
                      pointer
                      onClick={() => handleImgClick(buildRef.data)}
                      onContextMenu={() => handleImgContextMenu(buildRef.data)}
                    />
                  </CyanTooltip>
                  {'　'}

                  <Typography variant="subtitle1">{buildRef.num && ` x${buildRef.num}`}</Typography>
                  {'　=>　'}
                </>
              )}
              <CyanTooltip title={name} placement="top">
                <IconImage
                  float="left"
                  size={36}
                  src={imgData}
                  pointer
                  onClick={() => handleImgClick(dropFrom)}
                  onContextMenu={() => handleImgContextMenu(dropFrom)}
                />
              </CyanTooltip>
              {'　'}
              {agent && (
                <>
                  {'=>　'}
                  <Typography variant="subtitle1" color="primary" component="span">
                    {agent ? agent.desc : desc}
                  </Typography>
                  {'　'}
                  <CyanTooltip title={agent.name} placement="top">
                    <IconImage
                      float="left"
                      size={36}
                      src={agent.imgData}
                      pointer
                      onClick={() => handleImgClick(agent)}
                      onContextMenu={() => handleImgContextMenu(agent)}
                    />
                  </CyanTooltip>
                  <Typography variant="subtitle1">{'　=>　'}</Typography>
                </>
              )}
              <Typography variant="subtitle1" color="primary" component="span">
                {desc}
              </Typography>
            </BuildDescCell>
          );
        })}
    </>
  );
};

const BuildFromPanel: FC<{
  data: Good;
  goodDB: DBHelper<Good>;
  handleImgClick: (info: ObjDisplayInfo) => void;
  handleImgContextMenu: (info: ObjDisplayInfo) => void;
  local: Local;
}> = ({ data, goodDB, handleImgClick, handleImgContextMenu, local }) => {
  const { buildFroms } = data;
  return (
    <div>
      <CardHeader title={local.views.good.buildFrom}></CardHeader>
      <Paper>
        <TableContainer style={{ minHeight: '100%', minWidth: '100%', overflow: 'hidden' }}>
          <Table size="small">
            <TableBody>
              {buildFroms.map((buildFrom, index) => {
                if (Array.isArray(buildFrom)) {
                  const infos = buildFrom.map(bf => ({
                    ...goodDB.find('id', bf.id),
                    num: bf.num,
                  }));

                  return (
                    <TableRow key={index} hover>
                      <TableCell align="left">
                        {infos.map(info => (
                          <div key={info.id}>
                            <IconImage
                              float="left"
                              size={36}
                              src={info.imgData}
                              pointer
                              onClick={() => handleImgClick(info)}
                              onContextMenu={() => handleImgContextMenu(info)}
                            />
                          </div>
                        ))}
                      </TableCell>
                      <TableCell align="left">
                        <div>
                          {infos.map(info => (
                            <Typography variant="body1" key={info.name}>
                              {info.name}
                              <Typography variant="body1" color="primary" component="span">
                                [{local.common.optional}]
                              </Typography>
                            </Typography>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        {infos.map(info => {
                          const { dropFroms, buildFroms, goodType } = info;
                          return (
                            <React.Fragment key={info.id}>
                              {dropFroms && (
                                <MultiDropWrapper>
                                  <ItemDropFrom
                                    dropFroms={dropFroms}
                                    handleImgClick={handleImgClick}
                                    handleImgContextMenu={handleImgContextMenu}
                                  />
                                </MultiDropWrapper>
                              )}
                              {/* 碎片项处理 */}
                              {goodType === 6 &&
                                buildFroms?.length === 1 &&
                                buildFroms.map((buildFrom, index) => {
                                  const data = goodDB.find('id', buildFrom.id);
                                  // 处理金币银币
                                  if (['I0OZ', 'I0O0', 'I0NZ'].includes(buildFrom.id)) {
                                    return (
                                      <BuildDescCell>
                                        <CyanTooltip title={data.name} placement="top">
                                          <IconImage
                                            float="left"
                                            size={36}
                                            src={data.imgData}
                                            pointer
                                            onClick={() => handleImgClick(data)}
                                            onContextMenu={() => handleImgContextMenu(data)}
                                          />
                                        </CyanTooltip>
                                        {'　'}
                                        <Typography variant="subtitle1">
                                          {buildFrom.num && ` x ${buildFrom.num}`}
                                        </Typography>
                                        {'　=>　'}
                                        <>
                                          {data.dropFroms &&
                                            data.dropFroms.map((dropFrom, key) => {
                                              return (
                                                <CyanTooltip
                                                  key={key}
                                                  title={dropFrom.name}
                                                  placement="top"
                                                >
                                                  <StyledBadge
                                                    badgeContent={`${dropFrom.desc}`}
                                                    max={99999}
                                                    color="info"
                                                  >
                                                    <IconImage
                                                      style={{ marginLeft: 10, marginRight: 10 }}
                                                      float="left"
                                                      size={36}
                                                      src={dropFrom.imgData}
                                                      pointer
                                                      onClick={() => handleImgClick(dropFrom)}
                                                      onContextMenu={() =>
                                                        handleImgContextMenu(dropFrom)
                                                      }
                                                    />
                                                  </StyledBadge>
                                                </CyanTooltip>
                                              );
                                            })}
                                        </>
                                      </BuildDescCell>
                                    );
                                  }
                                  return (
                                    <MultiDropWrapper key={index}>
                                      <ItemDropFrom
                                        buildRef={{ data, num: buildFrom.num }}
                                        dropFroms={data.dropFroms}
                                        handleImgClick={handleImgClick}
                                        handleImgContextMenu={handleImgContextMenu}
                                      />
                                    </MultiDropWrapper>
                                  );
                                })}
                              {/* 非碎片项处理 */}
                              {goodType === 6 && buildFroms?.length > 1 && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  {buildFroms.map((buildFrom, index) => {
                                    return (
                                      <React.Fragment key={index}>
                                        <CyanTooltip title={buildFrom.name} placement="top">
                                          <IconImage
                                            float="left"
                                            size={36}
                                            src={buildFrom.imgData}
                                            pointer
                                            onClick={() => handleImgClick(buildFrom)}
                                            onContextMenu={() => handleImgContextMenu(buildFrom)}
                                          />
                                        </CyanTooltip>
                                        <Typography variant="body1">
                                          {buildFrom.num && `　x${buildFrom.num}`}
                                          {index + 1 !== buildFroms.length && '　+　'}
                                        </Typography>
                                      </React.Fragment>
                                    );
                                  })}
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </TableCell>

                      <TableCell align="left">
                        {infos.map(info => (
                          <Typography key={info.id} variant="subtitle1" color="primary">
                            {info.num}
                          </Typography>
                        ))}
                      </TableCell>
                    </TableRow>
                  );
                }

                const { id, name, imgData, num, choose } = buildFrom;
                const { dropFroms, buildFroms, goodType } = goodDB.find('id', id);
                return (
                  <TableRow key={index} hover>
                    <TableCell align="left">
                      <IconImage
                        float="left"
                        size={36}
                        src={imgData}
                        pointer
                        onClick={() => handleImgClick(buildFrom)}
                        onContextMenu={() => handleImgContextMenu(buildFrom)}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body1">
                        {name}
                        {choose && (
                          <Typography variant="body1" color="primary" component="span">
                            [{local.common.optional}]
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      {dropFroms && (
                        <MultiDropWrapper>
                          <ItemDropFrom
                            dropFroms={dropFroms}
                            handleImgClick={handleImgClick}
                            handleImgContextMenu={handleImgContextMenu}
                          />
                        </MultiDropWrapper>
                      )}
                      {/* 碎片项处理 */}
                      {goodType === 6 &&
                        buildFroms?.length === 1 &&
                        buildFroms.map((buildFrom, index) => {
                          const data = goodDB.find('id', buildFrom.id);
                          // 处理金币银币
                          if (['I0OZ', 'I0O0', 'I0NZ'].includes(buildFrom.id)) {
                            return (
                              <BuildDescCell>
                                <CyanTooltip title={data.name} placement="top">
                                  <IconImage
                                    float="left"
                                    size={36}
                                    src={data.imgData}
                                    pointer
                                    onClick={() => handleImgClick(data)}
                                    onContextMenu={() => handleImgContextMenu(data)}
                                  />
                                </CyanTooltip>
                                {'　'}
                                <Typography variant="subtitle1">
                                  {buildFrom.num && ` x ${buildFrom.num}`}
                                </Typography>
                                {'　=>　'}
                                <>
                                  {data.dropFroms &&
                                    data.dropFroms.map((dropFrom, key) => {
                                      return (
                                        <CyanTooltip
                                          key={key}
                                          title={dropFrom.name}
                                          placement="top"
                                        >
                                          <StyledBadge
                                            badgeContent={`${dropFrom.desc}`}
                                            max={99999}
                                            color="info"
                                          >
                                            <IconImage
                                              style={{ marginLeft: 10, marginRight: 10 }}
                                              float="left"
                                              size={36}
                                              src={dropFrom.imgData}
                                              pointer
                                              onClick={() => handleImgClick(dropFrom)}
                                              onContextMenu={() => handleImgContextMenu(dropFrom)}
                                            />
                                          </StyledBadge>
                                        </CyanTooltip>
                                      );
                                    })}
                                </>
                              </BuildDescCell>
                            );
                          }
                          return (
                            <MultiDropWrapper key={index}>
                              <ItemDropFrom
                                buildRef={{ data, num: buildFrom.num }}
                                dropFroms={data.dropFroms}
                                handleImgClick={handleImgClick}
                                handleImgContextMenu={handleImgContextMenu}
                              />
                            </MultiDropWrapper>
                          );
                        })}
                      {/* 非碎片项处理 */}
                      {goodType === 6 && buildFroms?.length > 1 && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {buildFroms.map((buildFrom, index) => {
                            return (
                              <React.Fragment key={index}>
                                <CyanTooltip title={buildFrom.name} placement="top">
                                  <IconImage
                                    float="left"
                                    size={36}
                                    src={buildFrom.imgData}
                                    pointer
                                    onClick={() => handleImgClick(buildFrom)}
                                    onContextMenu={() => handleImgContextMenu(buildFrom)}
                                  />
                                </CyanTooltip>
                                <Typography variant="body1">
                                  {buildFrom.num && `　x${buildFrom.num}`}
                                  {index + 1 !== buildFroms.length && '　+　'}
                                </Typography>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      )}
                    </TableCell>

                    <TableCell align="left">
                      <Typography variant="subtitle1" color="primary" component="span">
                        {num}
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

export default BuildFromPanel;
