import React, { useState } from 'react';
import { WindowTable } from 'react-window-table';
import { useStoreState, useStoreActions } from '@renderer/store';
import IconImage from '@renderer/components/IconImage';
import { Typography, Button } from '@material-ui/core';
import { UnitDropInfo } from '@renderer/dataHelper/types';
import LiteTooltip from 'react-tooltip-lite';
import { getAnchor, message } from '@renderer/helper';
import TargetPanel from './TargetPanel';
import Footer from './Footer';

const mdxConfig = {
  n03S: 'HeroDracoRich.mdx',
  n01N: 'AvengingAngel.mdx',
  h01K: 'FelGuard.mdx',
  h06T: 'WaterElemental.mdx', //水
  h060: 'FireTempleKeeperElemental.mdx', //火
  h04O: 'TaurenRock.mdx', //牛
};

const UnitView = () => {
  const local = useStoreState(state => state.app.local);
  const dataHelper = useStoreState(state => state.app.dataHelper);
  const selectedTarget = useStoreState(state => state.common.selectedTarget);
  const { unitDB } = dataHelper;
  const [filterStage, setFilterStage] = useState(0);
  const setDetailView = useStoreActions(actions => actions.view.setDetailView);
  const addCacheId = useStoreActions(actions => actions.good.addCacheId);
  const addTargetItem = useStoreActions(actions => actions.common.addTargetItem);
  const setMdxView = useStoreActions(actions => actions.view.setMdxView);

  const data = unitDB
    .filter(unit => (filterStage ? unit.stage === filterStage : true))
    .sort((a, b) => b.stage - a.stage);

  return (
    <>
      <TargetPanel disableShow />
      <WindowTable
        cancelMouseMove={false}
        maxHeight={innerHeight - 211}
        rows={data}
        rowCount={data.length}
        rowHeight={(index: number) => {
          if (index === 0) {
            return 40;
          }
          return 64;
        }}
        columnCount={2}
        columnWidth={index => [48, 64, 300, 80, innerWidth - 48 - 64 - 300 - 80 - 12][index]}
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
            textAlign: 'center',
            label: ' ',
            render: (rowData, unit, { rowIndex }) => rowIndex + 1,
          },
          {
            name: 'imgData',
            textAlign: 'center',
            label: local.views.unit.image,
            render: (imgData, unit) => (
              <IconImage
                pointer={mdxConfig[unit.id]}
                size={48}
                src={imgData}
                onClick={() => {
                  if (mdxConfig[unit.id]) {
                    setMdxView({ show: true, name: mdxConfig[unit.id] });
                  }
                }}
              />
            ),
          },
          {
            name: 'name',
            label: local.views.unit.name,
            textAlign: 'center',
            render: name => <Typography variant="body1">{name}</Typography>,
          },
          {
            name: 'stage',
            label: local.views.unit.stage,
            textAlign: 'center',
            render: stage => (
              <Typography variant="body1" color="secondary">
                {local.common.stages[stage]}
              </Typography>
            ),
          },
          {
            name: 'drops',
            header: () => (
              <>
                {local.common.stages.map((stage, index) => (
                  <Button key={index} color="inherit" onClick={() => setFilterStage(index)}>
                    {stage || local.common.all}
                  </Button>
                ))}
              </>
            ),
            render: drops => {
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
                  {((drops as UnitDropInfo[]) || []).reduce((acc, drop) => {
                    const { id, name, imgData, desc, agentDrops } = drop;
                    acc.push(
                      <LiteTooltip
                        key={id}
                        content={
                          <div style={{ padding: 8, display: 'flex', minWidth: 'max-content' }}>
                            <Typography variant="body1" component="span">
                              {name}
                            </Typography>
                            <Typography variant="body1" component="span" color="secondary">
                              {`　${desc}`}
                            </Typography>
                          </div>
                        }
                        background="linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)"
                        direction="up"
                        padding={0}
                        arrow={false}
                        hoverDelay={0}
                        mouseOutDelay={0}
                      >
                        <IconImage
                          pointer
                          float="left"
                          size={48}
                          src={imgData}
                          onClick={e => setDetailView({ id, show: true, anchor: getAnchor(e) })}
                          onContextMenu={() => {
                            if (selectedTarget) {
                              addTargetItem(id);
                              message.success(
                                `${name}${local.common.addedToTarget}【${selectedTarget.name}】`,
                              );
                            } else {
                              addCacheId(id);
                              message.success(`${name}${local.common.addedToCache}`);
                            }
                          }}
                        />
                      </LiteTooltip>,
                    );
                    if (agentDrops) {
                      agentDrops.map((agentDrop, index) => {
                        acc.push(
                          <LiteTooltip
                            key={id + 'agent' + index}
                            content={
                              <div style={{ padding: 8, display: 'flex', minWidth: 'max-content' }}>
                                <Typography variant="body1" color="secondary" component="span">
                                  {desc}
                                </Typography>
                                <Typography variant="body1" component="span">
                                  {name}
                                  {'=>'}
                                </Typography>
                                <Typography variant="body1" component="span">
                                  {agentDrop.name}
                                </Typography>
                                <Typography variant="body1" component="span" color="secondary">
                                  {`　${agentDrop.desc}`}
                                </Typography>
                              </div>
                            }
                            background="linear-gradient(150deg, #6cd0f7 0%, #f3d7d7 103%)"
                            direction="up"
                            padding={0}
                            arrow={false}
                            hoverDelay={0}
                            mouseOutDelay={0}
                          >
                            <IconImage
                              pointer
                              size={48}
                              src={agentDrop.imgData}
                              onClick={e =>
                                setDetailView({
                                  id: agentDrop.id,
                                  show: true,
                                  anchor: getAnchor(e),
                                })
                              }
                              onContextMenu={() => {
                                if (selectedTarget) {
                                  addTargetItem(agentDrop.id);
                                  message.success(
                                    `${agentDrop.name}${local.common.addedToTarget}【${selectedTarget.name}】`,
                                  );
                                } else {
                                  addCacheId(agentDrop.id);
                                  message.success(`${agentDrop.name}${local.common.addedToCache}`);
                                }
                              }}
                            />
                          </LiteTooltip>,
                        );
                      });
                    }
                    return acc;
                  }, [])}
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

export default UnitView;
