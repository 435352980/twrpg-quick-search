import React, { useState, FC } from 'react';
import { Typography as MuiTypography, TypographyProps } from '@material-ui/core';
import { useStoreState } from '@renderer/store';
import styled from '@emotion/styled';
import CyanTooltip from '@renderer/components/CyanTooltip';
import IconImage from '@renderer/components/IconImage';
import { Good, DropFrom } from '@renderer/dataHelper/types';
import DBHelper from '@renderer/dataHelper/dbHelper';

const CalcRoot = styled.div`
  display: flex;
  flex-direction: column;
`;

const TargetImgsContainer = styled.div`
  margin-top: 16px;
  margin-right: 16px;
  margin-left: 16px;
  text-align: center;
`;

interface CalcItemsProps {
  /**
   * 目标物品ID列表
   */
  targetIds: string[];
  /**
   * 拥有物品ID列表
   */
  haveIds: string[];
}

const ItemWrapper = styled.div<{
  direction?: 'row' | 'column';
  noBg?: boolean;
  noPadding?: boolean;
  noMargin?: boolean;
  noAlignCenter?: boolean;
  justifyCenter?: boolean;
}>`
  display: flex;
  border-radius: 8px;
  flex-direction: ${({ direction }) => direction};
  ${({ justifyCenter }) => (justifyCenter ? 'justify-content: center;' : '')};
  ${({ noAlignCenter }) => (!noAlignCenter ? 'align-items: center;' : '')};
  ${({ noPadding }) => (!noPadding ? 'padding: 8px;' : '')};
  ${({ noMargin }) => (!noMargin ? 'margin-right: 16px;' : '')};
  ${({ noMargin }) => (!noMargin ? 'margin-left: 16px;' : '')};
  ${({ noBg }) => (!noBg ? 'background-color: #d0cfcf36;' : '')};
  :not(:last-of-type) {
    ${({ noMargin }) => (!noMargin ? 'margin-bottom: 16px;' : '')};
  }
  & img {
    margin-right: 8px;
  }
`;
const ItemDescWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 8px;
  justify-content: space-around;
`;

const ItemFromsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 8px;
  justify-content: space-around;
`;

// 解决图片生成时文字断行问题
const Typography = styled(MuiTypography)`
  white-space: nowrap;
  text-overflow: ellipsis;
` as React.ComponentType<TypographyProps & { component?: React.ElementType }>;

const WhiteSpace = () => <> </>;

const ItemDropFroms: FC<{ dropFroms?: DropFrom[] }> = ({ dropFroms }) => {
  return (
    <>
      {dropFroms &&
        dropFroms.map(({ id, name, imgData, desc, agent }, index) => (
          <ItemWrapper noBg noMargin noPadding key={id + index}>
            <CyanTooltip title={name} placement="top">
              <IconImage size={36} src={imgData} />
            </CyanTooltip>
            <WhiteSpace />
            {agent && (
              <>
                <Typography variant="subtitle1"> {'　=>　'}</Typography>

                <WhiteSpace />
                <Typography variant="body1" color="primary" component="span">
                  {agent ? agent.desc : desc}
                </Typography>
                <CyanTooltip title={agent.name} placement="top">
                  <IconImage size={36} src={agent.imgData} />
                </CyanTooltip>
                <Typography variant="subtitle1">{'　=>　'}</Typography>
              </>
            )}
            <WhiteSpace />
            <Typography variant="body1" color="primary" component="span">
              {desc}
            </Typography>
          </ItemWrapper>
        ))}
    </>
  );
};

const Item: FC<{
  id: string;
  sum: number;
  choose?: boolean;
  goodDB: DBHelper<Good>;
  haveSum: { [propName: string]: number };
  local: Local;
}> = ({ id, sum, choose = false, goodDB, haveSum, local }) => {
  const item = goodDB.find('id', id);
  const { dropFroms, buildFroms } = item;

  return (
    <>
      {/* 介绍 */}
      <td>
        <ItemWrapper noPadding noMargin noBg>
          <ItemDescWrapper>
            <IconImage size={56} src={item.imgData} />
          </ItemDescWrapper>

          <ItemDescWrapper>
            <Typography variant="body1">
              {item.name}
              <Typography variant="body1" color="primary" component="span">
                {local.common.stages[item.stage] || ''}
              </Typography>
            </Typography>
            {!choose && (
              <Typography variant="body1">
                {local.views.calc.requireCount}:<WhiteSpace />
                <Typography variant="body1" color="primary" component="span">
                  {sum}
                </Typography>
              </Typography>
            )}
          </ItemDescWrapper>
          {/* 直接获取方式 */}
          <ItemFromsWrapper>
            <ItemDropFroms dropFroms={dropFroms} />
          </ItemFromsWrapper>
        </ItemWrapper>
      </td>
      {/* 其他获取方式 */}
      <td>
        {buildFroms?.length === 1 && (
          <ItemWrapper direction="column" noAlignCenter justifyCenter style={{ minHeight: 48 }}>
            {buildFroms.map(buildFrom => {
              const { id, name, imgData, num } = buildFrom;
              // 添加boss关联
              const { dropFroms } = goodDB.find('id', id);
              return (
                <ItemWrapper key={id} noMargin noPadding noBg>
                  <ItemWrapper noMargin noPadding noBg>
                    <CyanTooltip title={name} placement="top">
                      <IconImage size={36} src={imgData} float="left" />
                    </CyanTooltip>

                    {num && ` x${num}`}
                  </ItemWrapper>
                  {/* 处理持有 */}
                  {haveSum[id] && (
                    <Typography variant="body1" color="primary">
                      {`　${local.views.calc.alreadyHave}:`}
                      {haveSum[id]}
                    </Typography>
                  )}
                  {/* 处理碎片项 */}
                  {dropFroms && <Typography variant="body1">{'　=>　'}</Typography>}
                  <ItemWrapper noMargin noPadding noBg direction="column" noAlignCenter>
                    <ItemDropFroms dropFroms={dropFroms} />
                  </ItemWrapper>
                </ItemWrapper>
              );
            })}
          </ItemWrapper>
        )}
        {buildFroms?.length > 1 &&
          buildFroms.map((buildFrom, index) => {
            return (
              <React.Fragment key={index}>
                <ItemWrapper noAlignCenter justifyCenter style={{ minHeight: 48 }}>
                  <CyanTooltip title={buildFrom.name} placement="top">
                    <IconImage size={36} src={buildFrom.imgData} />
                  </CyanTooltip>
                  <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
                    {buildFrom.num && ` x${buildFrom.num}`}

                    {/* {index + 1 !== buildFroms.length && '　+　'} */}
                  </Typography>
                </ItemWrapper>
              </React.Fragment>
            );
          })}
      </td>
    </>
  );
};

const CalcItems: FC<CalcItemsProps> = ({ targetIds = [], haveIds = [] }) => {
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const { goodDB } = dataHelper;
  const [selectItem, setSelectItem] = useState<string | null>();
  const { count, requireSum, chooseGroupSum, unnecessarySum, haveSum } = dataHelper.calcRequire(
    selectItem ? [selectItem] : targetIds,
    haveIds,
  );

  return (
    <CalcRoot>
      <TargetImgsContainer>
        {goodDB.getListByFieldValues(targetIds, 'id').map(({ id, name, imgData }, index) => {
          return (
            <CyanTooltip key={`${id}-${index}`} title={name} placement="top">
              <IconImage
                alt={name}
                size={32}
                pointer
                src={imgData}
                onClick={() => setSelectItem(id)}
                onContextMenu={() => setSelectItem(null)}
              />
            </CyanTooltip>
          );
        })}
      </TargetImgsContainer>
      <Typography variant="body1" align="center">
        {`${local.views.calc.count}:${count}`}
      </Typography>
      {/* 必须项 */}
      {Object.entries(requireSum).length > 0 && (
        <ItemWrapper noBg style={{ marginBottom: 0 }}>
          <Typography variant="h5" color="primary">
            {local.views.calc.necessaryItem}
          </Typography>
        </ItemWrapper>
      )}
      {Object.entries(requireSum)
        .sort((a, b) => b[1] - a[1])
        .map(([id, sum], index) => (
          <ItemWrapper key={index}>
            <table>
              <tbody>
                <tr>
                  <Item
                    id={id}
                    sum={sum}
                    goodDB={goodDB as DBHelper<Good>}
                    haveSum={haveSum}
                    local={local}
                  />
                </tr>
              </tbody>
            </table>
          </ItemWrapper>
        ))}
      {/* 可选项 id成对 */}
      {Object.entries(chooseGroupSum).length > 0 && (
        <ItemWrapper noBg style={{ marginBottom: 0 }}>
          <Typography variant="h5" color="primary">
            {local.views.calc.chooseItem}
          </Typography>
        </ItemWrapper>
      )}

      {Object.entries(chooseGroupSum)
        .sort((a, b) => b[1] - a[1])
        .map(([idsText, sum], index) => (
          <ItemWrapper key={idsText + index}>
            <Typography variant="body1">
              {local.views.calc.requireChooseCount}:
              <WhiteSpace />
              <Typography variant="body1" color="primary" component="span">
                {sum}
              </Typography>
              {'　=>　'}
            </Typography>

            <ItemWrapper direction="column" noBg noPadding noMargin>
              <table>
                <tbody>
                  {idsText.split(',').map((id, index) => (
                    <tr key={id + index}>
                      <Item
                        id={id}
                        sum={sum}
                        choose
                        goodDB={goodDB as DBHelper<Good>}
                        haveSum={haveSum}
                        local={local}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </ItemWrapper>
          </ItemWrapper>
        ))}
      {/* 杂项 */}
      {Object.entries(unnecessarySum).length > 0 && (
        <ItemWrapper noBg style={{ marginBottom: 0 }}>
          <Typography variant="h5" color="primary">
            {local.views.calc.unNecessaryItem}
          </Typography>
        </ItemWrapper>
      )}

      {Object.entries(unnecessarySum)
        .sort((a, b) => b[1] - a[1])
        .map(([id, sum], index) => (
          <ItemWrapper key={index}>
            <table>
              <tbody>
                <tr>
                  <Item
                    id={id}
                    sum={sum}
                    goodDB={goodDB as DBHelper<Good>}
                    haveSum={haveSum}
                    local={local}
                  />
                </tr>
              </tbody>
            </table>
          </ItemWrapper>
        ))}
    </CalcRoot>
  );
};

export default CalcItems;
