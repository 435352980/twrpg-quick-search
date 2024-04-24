import path from 'path';
import fs from 'fs';
import React, { useState, useCallback } from 'react';
import { TextField, Paper, Typography } from '@mui/material';
import orderBy from 'lodash/orderBy';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { getSaveGoods } from '@renderer/helper';
import { useStoreState } from '@renderer/store';
import IconImage from '@renderer/components/IconImage';
import { Good } from '@renderer/dataHelper/types';
import styled from '@emotion/styled';
import ColorBtn from '@renderer/components/ColorBtn';
import { goodDescSort, goodAscSort } from './util';

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 688px;
  flex: 1;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    width: 100%;
  }
`;

interface SelectPanelProps {
  handleChange: (good: Good) => void;
}

const SelectPanel: React.FC<SelectPanelProps> = ({ handleChange }) => {
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const { goodDB } = dataHelper;
  const [searchSource, setSearchSource] = useState(
    orderBy(
      goodDB.filter(item => item.cat && item.cat.includes('Equip')),
      [
        goodAscSort('goodType'),
        goodDescSort('stage'),
        goodDescSort('level'),
        goodDescSort('quality'),
      ],
      ['asc', 'desc', 'desc', 'desc'],
    ),
  );
  const setSearchType = useCallback(
    type => {
      setSearchSource(
        orderBy(
          goodDB.filter(item => item.cat && item.cat.includes(type)),
          [
            goodAscSort('goodType'),
            goodDescSort('stage'),
            goodDescSort('level'),
            goodDescSort('quality'),
          ],
          ['asc', 'desc', 'desc', 'desc'],
        ),
      );
    },
    [goodDB],
  );
  const cacheIds = useStoreState(state => state.good.cacheIds);
  const war3Path = useStoreState(state => state.app.war3Path);
  const documentsPath = useStoreState(state => state.app.documentsPath);
  const selectedFile = useStoreState(state => state.common.selectedFile);

  const neteasePath = path.join(war3Path, 'twrpg', `${selectedFile}.txt`);
  const battlenetPath = path.join(
    documentsPath,
    'Warcraft III',
    'CustomMapData',
    'TWRPG',
    `${selectedFile}.txt`,
  );

  const isExists =
    war3Path && selectedFile ? fs.existsSync(neteasePath) || fs.existsSync(battlenetPath) : false;

  const realPath = isExists ? (fs.existsSync(neteasePath) ? neteasePath : battlenetPath) : '';

  return (
    <SelectWrapper>
      <TextField
        label={local.views.team.searchPlaceholder}
        fullWidth
        margin="dense"
        variant="outlined"
        onChange={e => {
          const value = e.target.value;
          setSearchSource(
            orderBy(
              !value
                ? goodDB.filter(item => item.cat && item.cat.includes('Equip'))
                : goodDB
                    .raw()
                    .filter(good => good.name.toLowerCase().includes(value.toLowerCase())),
              [
                goodAscSort('goodType'),
                goodDescSort('stage'),
                goodDescSort('level'),
                goodDescSort('quality'),
              ],
              ['asc', 'desc', 'desc', 'desc'],
            ),
          );
        }}
      />
      <Paper elevation={0} style={{ marginBottom: 8, textAlign: 'center' }}>
        <ColorBtn
          size="small"
          variant="contained"
          color="primary"
          onClick={e => {
            if (war3Path && selectedFile && isExists) {
              const source = fs.readFileSync(realPath).toString();
              const [panel = [], bag = [], store = [], dust = []] = getSaveGoods(source);
              setSearchSource(
                [...panel, ...bag, ...store, ...dust].reduce((acc, name) => {
                  const good = goodDB.find('name', name);
                  if (good) {
                    acc.push(good);
                  }
                  return acc;
                }, []),
              );
            } else {
              setSearchSource([]);
            }
          }}
        >
          {local.views.team.save}
        </ColorBtn>
        <ColorBtn
          size="small"
          variant="contained"
          color="primary"
          onClick={e => setSearchSource(cacheIds.map(id => goodDB.find('id', id)))}
        >
          {local.views.team.cache}
        </ColorBtn>
        {['Weapon', 'Helm', 'Armor', 'Ring', 'Wings', 'Material', 'Icon'].map(type => (
          <ColorBtn
            key={type}
            size="small"
            variant="contained"
            color="primary"
            onClick={e => setSearchType(type)}
          >
            {local.common.categories[type]}
          </ColorBtn>
        ))}
      </Paper>
      <AutoSizer>
        {({ width, height }) => (
          <FixedSizeGrid
            width={width}
            height={height - 116}
            columnWidth={220}
            rowHeight={105}
            columnCount={3}
            rowCount={
              searchSource.length % 3 === 0 ? searchSource.length / 3 : searchSource.length / 3 + 1
            }
          >
            {({ columnIndex, rowIndex, style }) => {
              const no = columnIndex + rowIndex * 3;
              const good = no <= searchSource.length && searchSource[no];
              if (!good) {
                return <div />;
              }
              return (
                <ItemWrapper style={style}>
                  <IconImage size={64} src={good.imgData} onClick={() => handleChange(good)} />
                  <Typography variant="body1">{good.name}</Typography>
                </ItemWrapper>
              );
            }}
          </FixedSizeGrid>
        )}
      </AutoSizer>
    </SelectWrapper>
  );
};

export default SelectPanel;
