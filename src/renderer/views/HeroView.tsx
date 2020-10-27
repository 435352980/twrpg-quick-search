import React, { useState } from 'react';
import { WindowTable } from 'react-window-table';
import { getAnchor, message } from '@renderer/helper';
import { useStoreState, useStoreActions } from '@renderer/store';
import GamePanel from '@renderer/components/GamePanel';
import TargetPanel from '@renderer/views/TargetPanel';
import { useWindowSize } from '@renderer/hooks';
import styled from '@emotion/styled';
import IconImage from '@renderer/components/IconImage';
import UnitAttrs from '@renderer/components/UnitAttrs';
import { Typography } from '@material-ui/core';
import LiteTooltip from 'react-tooltip-lite';
import Footer from './Footer';

const ToggleHeader = styled(Typography)`
  cursor: pointer;
  width: 100%;
  text-align: center;
`;

const HeroTable = () => {
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const { heroDB } = dataHelper;
  const { innerWidth, innerHeight } = useWindowSize();
  const [toggleSkill, setToggleSkill] = useState(true);

  const addCacheId = useStoreActions(actions => actions.good.addCacheId);

  const selectedTarget = useStoreState(state => state.common.selectedTarget);
  const addTargetItem = useStoreActions(actions => actions.common.addTargetItem);

  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const setMdxView = useStoreActions(actions => actions.view.setMdxView);
  return (
    <>
      <TargetPanel disableShow />
      <WindowTable
        cancelMouseMove={false}
        maxHeight={innerHeight - 203}
        rows={heroDB.raw()}
        rowCount={heroDB.raw().length}
        rowHeight={(index: number) => {
          if (index === 0) {
            return 40;
          }
          if (toggleSkill) {
            const hero = heroDB.raw()[index - 1];
            const count =
              hero?.skills?.reduce((count, skill) => count + 1 + (skill.closeInfo ? 1 : 0), 0) || 0;
            if (count * 48 > innerWidth - 48 - 64 - 300 - 14) {
              return 96;
            }
          }
          return 64;
        }}
        columnCount={4}
        columnWidth={index => [48, 64, 300, innerWidth - 48 - 64 - 300 - 12][index]}
        minVisibleScrollViewWidth={0}
        minVisibleScrollViewHeight={0}
        theme={classNames => {
          return {
            [classNames.GUIDELINE_BOTTOM]: { height: '0!important' },
            [classNames.GUIDELINE_TOP]: { height: '0!important' },
            [classNames.GUIDELINE_RIGHT]: { height: '0!important' },
            [classNames.GUIDELINE_LEFT]: { height: '0!important' },

            [classNames.CELL]: {
              display: 'flex',
              fontSize: '1rem',
              padding: '0!important',
              borderRight: '2px solid #dedede',
              alignItems: 'center',
              lineHeight: '1.5',
              fontWeight: 400,
            },
            [classNames.HEADER]: { background: '#00bcd4 !important', color: 'white' },
            [classNames.ROW_EVEN]: { background: '#f6f7f8' },
          };
        }}
        columns={[
          {
            name: 'no',
            label: ' ',
            textAlign: 'center',
            render: (cellData, hero, { rowIndex }) => rowIndex,
          },
          {
            name: 'imgData',
            label: local.views.hero.image,
            textAlign: 'center',
            render: (imgData, hero) => {
              return (
                <LiteTooltip
                  content={<UnitAttrs data={hero} />}
                  direction="right"
                  arrow={false}
                  hoverDelay={0}
                  mouseOutDelay={0}
                  styles={{ height: '100%', display: 'flex', alignItems: 'center' }}
                >
                  <IconImage
                    pointer
                    size={48}
                    src={imgData}
                    onClick={e => {
                      const modelName = hero.mdx.replace(/\.mdl/, 'mdx');
                      if (modelName) {
                        setMdxView({ show: true, name: modelName, anchor: getAnchor(e) });
                      }
                    }}
                  />
                </LiteTooltip>
              );
            },
          },
          { label: local.views.hero.name, name: 'name', textAlign: 'center' },
          {
            name: 'toggleColumn',
            header: () => (
              <ToggleHeader variant="subtitle1" onClick={() => setToggleSkill(!toggleSkill)}>
                {toggleSkill ? local.views.hero.skill : local.views.hero.exclusive}
              </ToggleHeader>
            ),
            render: (cellData, hero) => {
              if (toggleSkill) {
                return (
                  <div
                    style={{
                      paddingLeft: 8,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    {hero.skills.reduce((acc, skill, index) => {
                      const { displayName, imgData, desc, closeInfo, hotKeys } = skill;
                      acc.push(
                        <LiteTooltip
                          key={hero.id + index}
                          content={
                            <GamePanel
                              desc={(hotKeys ? hotKeys + '\n' : '') + displayName + desc}
                            />
                          }
                          direction="up"
                          padding={0}
                          arrow={false}
                          hoverDelay={0}
                          mouseOutDelay={0}
                        >
                          <IconImage size={48} float="left" src={imgData} />
                        </LiteTooltip>,
                      );
                      if (closeInfo) {
                        acc.push(
                          <LiteTooltip
                            key={hero.id + index + 'closeInfo'}
                            content={
                              <GamePanel
                                desc={
                                  (hotKeys ? hotKeys + '\n' : '') +
                                  closeInfo.displayName +
                                  closeInfo.desc
                                }
                              />
                            }
                            direction="up"
                            padding={0}
                            arrow={false}
                            hoverDelay={0}
                            mouseOutDelay={0}
                          >
                            <IconImage size={48} float="left" src={imgData} />
                          </LiteTooltip>,
                        );
                      }
                      return acc;
                    }, [])}
                  </div>
                );
              }
              return (
                <div
                  style={{
                    paddingLeft: 8,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  {hero.exclusives &&
                    hero.exclusives.map(exclusive => (
                      <LiteTooltip
                        key={exclusive.id}
                        content={
                          <GamePanel
                            desc={`${exclusive.name}\n|c00ffff00${exclusive.on}\n|c00ffff00${exclusive.desc}`}
                          />
                        }
                        direction="up"
                        padding={0}
                        arrow={false}
                        hoverDelay={0}
                        mouseOutDelay={0}
                      >
                        <IconImage
                          size={48}
                          pointer
                          float="left"
                          src={exclusive.imgData}
                          onClick={e => {
                            setDetailView({
                              id: exclusive.id,
                              show: true,
                              anchor: getAnchor(e),
                              isGood: true,
                            });
                          }}
                          onContextMenu={() => {
                            if (selectedTarget) {
                              addTargetItem(exclusive.id);
                              message.success(`【${exclusive.name}】${local.common.addedToTarget}`);
                            } else {
                              addCacheId(exclusive.id);
                              message.success(`【${exclusive.name}】${local.common.addedToCache}`);
                            }
                          }}
                        />
                      </LiteTooltip>
                    ))}
                </div>
              );
            },
          },
        ]}
      />
      <Footer showCalc />
    </>
  );
};

export default HeroTable;
